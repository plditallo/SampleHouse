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

router.get("/", (req, res) => {
    const {
        limit = 25,
            ContinuationToken
    } = req.query;
    // console.log(req.query)

    s3.listObjectsV2({
        Bucket: 'samplehouse',
        Prefix: 'packs/',
        // Delimiter: "/", //used to not go 'deeper'
        MaxKeys: limit,
        // StartAfter: 'packs/SH Essential Drums/SH_Essential_Kick_07.wav',
        ContinuationToken: ContinuationToken.length ? ContinuationToken.replaceAll(" ", "+") : null
    }, (err, data) => {
        if (err) console.log("Error", err);
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
            if ((Key.includes(".wav")) || Key.includes(".mid")) sounds.push(Key)
        })
        // console.log(Sounds)
        res.status(200).json({
            IsTruncated,
            sounds,
            NextContinuationToken,
            Prefix
        })
    });
})

router.get("/:key", (req, res) => {
    const {
        key
    } = req.params;
    const downloadStream = s3Client.downloadStream({
        Bucket: 'samplehouse',
        Key: key
    });
    downloadStream.on('error', () => res.status(404).send('Not Found'))

    downloadStream.on('httpHeaders',
        (statusCode, headers, resp) =>
        res.set({
            'Content-Type': headers['content-type']
        }));

    // Pipe download stream to response
    downloadStream.pipe(res);

})


router.use("/", (req, res) => {
    res.status(200).json({
        Route: "Sound Route up"
    });
});

module.exports = router;

const allKeys = [];
// listAllKeys();

function listAllKeys() {
    s3.listObjectsV2(params, (err, data) => {
        if (err) {
            console.log(err, err.stack); // an error occurred
        } else {
            const contents = data.Contents;
            contents.forEach(function (content) {
                allKeys.push(content.Key);
            });

            if (data.IsTruncated) {
                params.ContinuationToken = data.NextContinuationToken;
                console.log("get further list...");
                listAllKeys();
            }
        }
    });
}
