const router = require("express").Router();
const userDb = require("../../../database/model/userModel");
const downloadDb = require("../../../database/model/soundDownloadModel");
const {
    getSounds,
    getSoundBy,
    getSoundsByTag,
    getSoundCount,
    getTags
} = require("../../../database/model/soundModel");
// const {
//     handleGetItemError
// } = require("../utils/dynamoDbErrors");
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


router.get("/", async (req, res) => {
    const {
        offset,
        limit = 25,
        tags
    } = req.query;
    console.log({
        tags
    }, tags.length)
    let sounds = [];
    if (tags.length === 0) sounds = await getSounds(limit, offset);
    else sounds = await getSoundsByTag(limit, offset, tags)
    console.log(sounds.length, {
        sounds
    })
    return res.status(200).send(sounds)

    // s3.listObjectsV2({
    //     Bucket: 'samplehouse',
    //     Prefix: 'packs/',
    //     // Delimiter: "/", //used to not go 'deeper'
    //     MaxKeys: limit,
    //     // StartAfter: 'packs/SH Essential Drums/SH_Essential_Kick_07.wav',
    //     ContinuationToken: ContinuationToken.length ? ContinuationToken.replaceAll(" ", "+") : null
    // }, (err, data) => {
    //     if (err) console.error("Error /", err);
    //     // else console.log("Success", data)
    //     const {
    //         NextContinuationToken,
    //         Contents,
    //         IsTruncated,
    //         Prefix
    //     } = data;
    //     const sounds = [];
    //     Contents.forEach(({
    //         Key
    //     }) => {
    //         if ((Key.includes(".wav")) || Key.includes(".mid")) sounds.push(Key.replace(Prefix, ""))
    //     })
    //     if (data) res.status(200).json({
    //         IsTruncated,
    //         sounds,
    //         NextContinuationToken,
    //         Prefix
    //     })
    // });
})

router.get("/count", async (req, res) => {
    const [count] = await getSoundCount()
    res.status(200).json(count['count(*)'])
});

router.get("/tags", async (req, res) => {
    const tagsList = [];
    const tagsFetched = await getTags()
    tagsFetched.forEach(({
        tags
    }) => tags ? tags.split(",").forEach(e => tagsList.includes(e) ? null : tagsList.push(e)) : null)
    res.status(200).json(tagsList)
    // res.status(200).json(count['count(*)'])

});

router.get("/stream/:key", (req, res) => {
    const key = req.params.key;
    console.log("stream", key)
    //! key: SH Essential Drums/SH_Essential_Hat_01.wav
    downloadStream(res, key).pipe(res) // Pipe download stream to response
})

router.get("/cover/:key", (req, res) => {
    const key = req.params.key;
    //! key: 'SH Essential Drums'

    s3.getObject({
        Bucket: 'samplehouse',
        Key: `covers/${key}.png`,
    }, (err, data) => {
        // if (err) console.error("Error /cover key:", key, err)//! out for testing
        // else console.log("Success", data.Body)
        if (data) res.status(200).json(data.Body)
    })
})

router.get("/download/:key", async (req, res) => {
    const key = req.params.key;
    // console.log(key)
    const user = req.user;
    const soundName = key.split("/")[1]
    //todo update dynamoDb download count
    //todo check all exclusive sounds if they have been downloaded before (other users)
    const [previousDownload] = await downloadDb.checkDownloadByUser(user.id, soundName)
    // todo check exclusive downloads -> downloadDb.getExclusiveDownloads()

    // insert
    if (!previousDownload) {
        console.log("not downloaded");
        const [sound] = await getSoundBy("name", soundName)
        const {
            exclusive
        } = sound;
        const creditCost = exclusive ? 15 : 1;
        // console.log("balance before", user.balance); //! testing
        if ((user.balance - creditCost) < 0) return res.status(222).json({
            msg: "Credit balance is insufficient."
        });
        user.balance -= creditCost;
        // console.log("balance after", user.balance); //! testing
        await downloadDb.insertDownload({
            name: soundName,
            userId: user.id,
            downloaded_at: Date.now(),
            exclusive
        })
        await userDb.updateUser(user)
        res.status(225) //to update balance
    } else console.log("already downloaded") //! testing
    downloadStream(res, key).pipe(res); //Pipe download stream to response

})
//? todo the client is refreshing because of an update to the userDb or downloadDb

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
    downloadStream.on('Error', () => res.status(404).send('Not Found').end())
    downloadStream.on('httpHeaders',
        (statusCode, headers, resp) =>
        res.set({
            'Content-Type': headers['content-type']
        }));
    return downloadStream
}

// async function getDynamoSound(querySchema) {
//     AWS.config.update({ //!testing on localhost only
//         region: 'localhost',
//         endpoint: 'http://localhost:8000'
//     })
//     const dynamoDbClient = new AWS.DynamoDB(); //! testing-move to top after using localhost

//     try {
//         const fetchedSound = await dynamoDbClient.getItem(querySchema).promise();
//         return fetchedSound.Item
//     } catch (err) {
//         return handleGetItemError(err);
//     }
// }
