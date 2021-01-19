require("dotenv").config(); //do I need this once implemented into route??

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

// Create the parameters for calling listObjects
const bucketParams = {
    Bucket: 'samplehouse',
    // Delimiter: "/",
    Prefix: "covers/"
};
const objectParams = {
    Bucket: 'samplehouse',
    Key: "packs/SH Essential Drums/SH_Essential_Hat_01.wav"
}

//! List of the objects in the bucket 
// s3.listObjectsV2(bucketParams, (err, data) => {
//     if (err) console.log("Error", err);
//     else console.log("Success", data);
// });

s3.getObject(objectParams, (err, data) => {
    if (err) console.log("Error", err);
    else console.log("Success", data);
})
s3.getObjectTagging(objectParams, (err, data) => {
    if (err) console.log("Error", err);
    else console.log("Success", data);
})
