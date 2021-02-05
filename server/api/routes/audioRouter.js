const router = require("express").Router();
const userDb = require("../../../database/model/userModel");
const soundDb = require("../../../database/model/soundDownloadModel");
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

router.get("/:key", (req, res) => {
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

router.get("/tag/:key", (req, res) => {
    const {
        key
    } = req.params;
    s3.getObjectTagging({
        Bucket: 'samplehouse',
        Key: `packs/${key}`
    }, (err, data) => {
        if (err) console.error("Error /tag", err)
        else console.log("Success", data)
        if (data) res.status(200).json(data.TagSet)
    })
})

router.get("/download/:key/:userId", async (req, res) => {
    console.log(req.params);
    const {
        key,
        userId
    } = req.params;

    AWS.config.update({ //!testing on localhost only
        region: 'localhost',
        endpoint: 'http://localhost:8000'
    })
    const dynamoDbClient = new AWS.DynamoDB(); //! testing-move to top after using localhost

    const soundPack = key.split("/")[0]
    const soundName = key.split("/")[1]
    let dynamoSound;
    // Create the input for getItem call
    const querySearchSchema = {
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
        console.log({
            user
        })
        if (user)
            soundDb.checkDownloadByUser(userId, soundName).then(async ([resp]) => {
                console.log({
                    resp
                })
                if (!resp) {
                    console.log("no resp")
                    try {
                        dynamoSound = await dynamoDbClient.getItem(querySearchSchema).promise();
                        dynamoSound = dynamoSound.Item
                    } catch (err) {
                        return handleGetItemError(err);
                    }
                    console.log(dynamoSound)
                    const exclusive = dynamoSound.exclusive.BOOL;
                    const creditCost = exclusive ? 15 : 1
                    console.log("balance before", user.balance)
                    if ((user.balance - creditCost) < 0) return res.status(222).json({
                        msg: "Credit balance is insufficient."
                    })
                    user.balance -= creditCost
                    console.log("balance after", user.balance)
                    await soundDb.insertDownload({
                        name: soundName,
                        userId,
                        downloaded_at: Date.now(),
                        exclusive
                    }).then(console.log("insertSound")) //!null
                    await userDb.updateUser(user).then(console.log("updateUser")) //!null
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

//! DynamoDB ERRORS
// Handles errors during GetItem execution. Use recommendations in error messages below to 
// add error handling specific to your application use-case. 
function handleGetItemError(err) {
    if (!err) {
        console.error('Encountered error object was empty');
        return;
    }
    if (!err.code) {
        console.error(`An exception occurred, investigate and configure retry strategy. Error: ${JSON.stringify(err)}`);
        return;
    }
    // here are no API specific errors to handle for GetItem, common DynamoDB API errors are handled below
    handleCommonErrors(err);
}

function handleCommonErrors(err) {
    switch (err.code) {
        case 'InternalServerError':
            console.error(`Internal Server Error, generally safe to retry with exponential back-off. Error: ${err.message}`);
            return;
        case 'ProvisionedThroughputExceededException':
            console.error(`Request rate is too high. If you're using a custom retry strategy make sure to retry with exponential back-off. ` +
                `Otherwise consider reducing frequency of requests or increasing provisioned capacity for your table or secondary index. Error: ${err.message}`);
            return;
        case 'ResourceNotFoundException':
            console.error(`One of the tables was not found, verify table exists before retrying. Error: ${err.message}`);
            return;
        case 'ServiceUnavailable':
            console.error(`Had trouble reaching DynamoDB. generally safe to retry with exponential back-off. Error: ${err.message}`);
            return;
        case 'ThrottlingException':
            console.error(`Request denied due to throttling, generally safe to retry with exponential back-off. Error: ${err.message}`);
            return;
        case 'UnrecognizedClientException':
            console.error(`The request signature is incorrect most likely due to an invalid AWS access key ID or secret key, fix before retrying. ` +
                `Error: ${err.message}`);
            return;
        case 'ValidationException':
            console.error(`The input fails to satisfy the constraints specified by DynamoDB, ` +
                `fix input before retrying. Error: ${err.message}`);
            return;
        case 'RequestLimitExceeded':
            console.error(`Throughput exceeds the current throughput limit for your account, ` +
                `increase account level throughput before retrying. Error: ${err.message}`);
            return;
        default:
            console.error(`An exception occurred, investigate and configure retry strategy. Error: ${err.message}`);
            return;
    }
}
