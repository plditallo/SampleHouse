const router = require("express").Router();
const s3Client = require("s3").createClient()
const AWS = require('aws-sdk')
AWS.config.update({
    region: 'us-west-1'
})
// Create S3 service object
const s3 = new AWS.S3({
    apiVersion: '2006-03-01'
});
// todo find out how to download full files from S3

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
        if (err) console.log("Error /", err);
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
        // console.log(Sounds)
        if (data) res.status(200).json({
            IsTruncated,
            sounds,
            NextContinuationToken,
            Prefix
        })
    });
})

router.get("/:key", (req, res) => {
    const downloadStream = s3Client.downloadStream({
        Bucket: 'samplehouse',
        Key: `packs/${req.params.key}`
    });
    downloadStream.on('Error', () => res.status(404).send('Not Found'))
    downloadStream.on('httpHeaders',
        (statusCode, headers, resp) =>
        res.set({
            'Content-Type': headers['content-type']
        }));
    downloadStream.pipe(res); // Pipe download stream to response
})

router.get("/cover/:key", (req, res) => {
    const {
        key
    } = req.params

    s3.getObject({
        Bucket: 'samplehouse',
        Key: `covers/${key}.png`,
    }, (err, data) => {
        if (err) console.log("Error /cover", err)
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
        if (err) console.log("Error /tag", err)
        else console.log("Success", data)
        if (data) res.status(200).json(data.TagSet)
    })
})

router.use("/", (req, res) => {
    res.status(200).json({
        Route: "Sound Route up"
    });
});

module.exports = router;
