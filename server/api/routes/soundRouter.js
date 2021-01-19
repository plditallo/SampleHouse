const router = require("express").Router();
const {
    STRIPE_API_SECRET_KEY,
    API_ADDRESS
} = process.env;

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

//? Can we have home page full of packs instead of sounds? Sounds takes too long to "GET"

router.get("/", (req, res) => {
    s3.listObjectsV2({
        Bucket: 'samplehouse',
        Prefix: 'packs/'
    }, (err, data) => {
        if (err) console.log("Error", err);
        else console.log("Success", data);
        res.status(200).json(data)
    });
})


router.use("/", (req, res) => {
    res.status(200).json({
        Route: "Purchase Route up"
    });
});

module.exports = router;
