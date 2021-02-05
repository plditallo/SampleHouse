const router = require("express").Router();
const {
    handleGetItemError
} = require("../utils/dynamoDbErrors");
const AWS = require('aws-sdk');
AWS.config.update({
    region: "us-west-1"
})
AWS.config.update({ //!testing on localhost only
    region: 'localhost',
    endpoint: 'http://localhost:8000'
})
const dynamoDbClient = new AWS.DynamoDB();

router.get("/", (req, res) => {
    // todo change searchSchema
    const querySearchSchema = {
        "TableName": "Movies",
        "Key": {
            "pack": {
                "S": soundPack
            },
        }
    }
    try {
        // todo change getItem
        dynamoSoundList = await dynamoDbClient.getItem(querySearchSchema).promise();
        res.status(200).json(dynamoSoundList.Item)
    } catch (err) {
        return handleGetItemError(err);
    }
})

module.exports = router;
