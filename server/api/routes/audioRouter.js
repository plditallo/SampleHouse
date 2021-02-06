const router = require("express").Router();
const userDb = require("../../../database/model/userModel");
const soundDb = require("../../../database/model/soundDownloadModel");
const {
    handleGetItemError
} = require("../utils/dynamoDbErrors");
const s3Client = require("s3").createClient();
const AWS = require('aws-sdk');
AWS.config.update({
    region: "us-west-1"
})
// Create S3 service object
const s3 = new AWS.S3({
    apiVersion: '2006-03-01'
});

// Create the DynamoDB Client with the region you want
// const dynamoDbClient = new AWS.DynamoDB(); //todo to go off localhost
// Use the following config instead when using DynamoDB Local
// AWS.config.update({region: 'localhost', endpoint: 'http://localhost:8000', accessKeyId: 'access_key_id', secretAccessKey: 'secret_access_key'});


router.get("/", (req, res) => {
    const {
        limit = 25,
            ContinuationToken
    } = req.query;

    s3.listObjectsV2({
        Bucket: 'samplehouse',
        Prefix: 'packs/',
        // Delimiter: "/", //used to not go 'deeper'
        MaxKeys: limit,
        // StartAfter: 'packs/SH Essential Drums/SH_Essential_Kick_07.wav',
        ContinuationToken: ContinuationToken.length ? ContinuationToken.replaceAll(" ", "+") : null
    }, (err, data) => {
        if (err) console.error("Error /", err);
        // else console.log("Success", data)
        const {
            NextContinuationToken,
            Contents,
            IsTruncated,
            Prefix
        } = data;
        const sounds = [];
        Contents.forEach(({
            Key
        }) => {
            if ((Key.includes(".wav")) || Key.includes(".mid")) sounds.push(Key.replace(Prefix, ""))
        })
        if (data) res.status(200).json({
            IsTruncated,
            sounds,
            NextContinuationToken,
            Prefix
        })
    });
})

router.get("/stream/:key", (req, res) => {
    downloadStream(res, req.params.key).pipe(res) // Pipe download stream to response
})

router.get("/cover/:key", (req, res) => {
    const {
        key
    } = req.params

    s3.getObject({
        Bucket: 'samplehouse',
        Key: `covers/${key}.png`,
    }, (err, data) => {
        if (err) console.error("Error /cover key:", key, err)
        // else console.log("Success", data.Body)
        if (data) res.status(200).json(data.Body)
    })
})

router.post("/tags", async (req, res) => {
    const soundsArr = req.body;
    const dynamoSoundList = [];
    soundsArr.forEach(async e => {
        const dynamoSound = await getDynamoSound({
            "TableName": "Sounds",
            "Key": {
                "pack": {
                    "S": e.split("/")[0] //soundPack
                },
                "name": {
                    "S": e.split("/")[1] //soundName
                }
            }
        })
        dynamoSoundList.push(dynamoSound);
        if (dynamoSoundList.length === soundsArr.length) res.status(200).send(dynamoSoundList)
    })
})

router.get("/download/:key/:userId", async (req, res) => {
    console.log(req.params);
    const {
        key,
        userId
    } = req.params;

    const soundPack = key.split("/")[0]
    const soundName = key.split("/")[1]

    // Create the input for getItem call
    const querySchema = {
        "TableName": "Sounds",
        "Key": {
            "pack": {
                "S": soundPack
            },
            "name": {
                "S": soundName
            }
        }
    }
    //todo update dynamoDb download count
    // check all exclusive sounds if they have been downloaded before (other users)

    userDb.getUserById(userId).then(([user]) => {
        // console.log({
        //     user
        // })
        if (user)
            soundDb.checkDownloadByUser(userId, soundName).then(async ([resp]) => {
                console.log({
                    resp
                })
                if (!resp) {
                    console.log("not downloaded")
                    const dynamoSound = await getDynamoSound(querySchema)
                    user.balance = 50; //!testing
                    const exclusive = dynamoSound.exclusive.BOOL;
                    const creditCost = exclusive ? 15 : 1
                    console.log("balance before", user.balance)
                    if ((user.balance - creditCost) < 0) return res.status(222).json({
                        msg: "Credit balance is insufficient."
                    })
                    user.balance -= creditCost
                    console.log("balance after", user.balance)
                    // soundDb.insertDownload({
                    //     name: soundName,
                    //     userId,
                    //     downloaded_at: Date.now(),
                    //     exclusive
                    // }).then(() => {
                    //     console.log("insertSound")
                    //       userDb.updateUser(user).then(console.log("updateUser")) //!null
                    // })
                    //? todo the client is refreshing because of an update to the userDb or soundDb
                } else console.log("already downloaded")
                console.log("download stream")
                downloadStream(res, key).pipe(res) // Pipe download stream to response
            })
        else console.log("no user found")
    })
})

router.use("/", (req, res) => {
    res.status(200).json({
        Route: "Sound Route up"
    });
});

module.exports = router;

function downloadStream(res, key) {
    const downloadStream = s3Client.downloadStream({
        Bucket: 'samplehouse',
        Key: `packs/${key}`
    });
    downloadStream.on('Error', () => res.status(404).send('Not Found'))
    downloadStream.on('httpHeaders',
        (statusCode, headers, resp) =>
        res.set({
            'Content-Type': headers['content-type']
        }));
    return downloadStream
}

async function getDynamoSound(querySchema) {
    AWS.config.update({ //!testing on localhost only
        region: 'localhost',
        endpoint: 'http://localhost:8000'
    })
    const dynamoDbClient = new AWS.DynamoDB(); //! testing-move to top after using localhost

    try {
        const fetchedSound = await dynamoDbClient.getItem(querySchema).promise();
        return fetchedSound.Item
    } catch (err) {
        return handleGetItemError(err);
    }
}
