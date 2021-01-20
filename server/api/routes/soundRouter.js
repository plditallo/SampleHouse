const router = require("express").Router();
const s3Client = require("s3")
// Load the SDK for JavaScript
const AWS = require('aws-sdk');
// Set the Region 
AWS.config.update({
    region: 'us-west-1'
});
// Create S3 service object
const s3 = new AWS.S3({
    apiVersion: '2006-03-01'
});
const bucketParams = {
    Bucket: 'samplehouse',
    // Delimiter: "/",
    // Prefix: "covers/"
};
const objectParams = {
    Bucket: 'samplehouse',
    Key: "packs/SH Essential Drums/SH_Essential_Hat_01.wav"
}

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
        const Sounds = [];
        Contents.forEach(({
            Key
        }) => {
            if ((Key.includes(".wav")) || Key.includes(".mid")) Sounds.push(Key)
        })
        // console.log(Sounds)
        res.status(200).json({
            IsTruncated,
            Sounds,
            NextContinuationToken,
            Prefix
        })
    });
})

const client = s3Client.createClient({
    s3Options: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
})
router.get("/:path", (req, res) => {
    const {
        path
    } = req.params;



    const downloadStream = client.downloadStream({
        Bucket: 'samplehouse',
        Key: path
    })
    downloadStream.on('httpHeaders', (statusCode, headers, resp) => res.set({
        'Content-Type': headers['content-type']
    }))
    downloadStream.pipe(res)

    // s3.getObject({
    //     Bucket: 'samplehouse',
    //     Key: path
    // }, (err, data) => {
    //     if (err) console.log("error", err)
    //     else console.log("success", data)

    //     res.status(200).json(data)
    // })

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
