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
        Key: req.params.key
    });
    downloadStream.on('error', () => res.status(404).send('Not Found'))
    downloadStream.on('httpHeaders',
        (statusCode, headers, resp) =>
        res.set({
            'Content-Type': headers['content-type']
        }));
    downloadStream.pipe(res); // Pipe download stream to response
})

router.get("/cover/:key", (req, res) => {
    let {
        key
    } = req.params

    s3.getObject({
        Bucket: 'samplehouse',
        Key: `covers/${key}.png`,
    }, (err, data) => {
        if (err) console.log("error", err)
        // else console.log("success", data.Body)
        if (data) res.status(200).json(data.Body)
    })
})


router.use("/", (req, res) => {
    res.status(200).json({
        Route: "Sound Route up"
    });
});

module.exports = router;

function encode(data) {
    var str = data.reduce(function (a, b) {
        return a + String.fromCharCode(b);
    }, "");
    return btoa(str).replace(/.{76}(?=.)/g, "$&\n");
}
