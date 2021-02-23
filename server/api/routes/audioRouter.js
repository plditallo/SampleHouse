const router = require("express").Router();
const userDb = require("../../../database/model/userModel");
const downloadDb = require("../../../database/model/soundDownloadModel");
const {
    getSounds,
    getSoundBy,
    getSoundsByTag,
    getSoundCount,
    getColumn,
} = require("../../../database/model/soundModel");
const {
    getTags,
    getInstruments,
    getGenre
} = require("../../../database/model/singleModel");
const s3Client = require("s3").createClient();
const AWS = require('aws-sdk');
AWS.config.update({
    region: "us-west-1"
})
// Create S3 service object
const s3 = new AWS.S3({
    apiVersion: '2006-03-01'
});

router.get("/", async (req, res) => {
    const {
        offset = 0,
            limit = 25,
            tags,
            genres,
            instrument_type
    } = req.query;
    console.log({
        tags,
        genres,
        instrument_type
    })
    const sounds = await getSounds(limit, offset)
    if (sounds) res.status(200).send(sounds)
    else res.status(500).json({
        "msg": "unable to fetch sounds"
    })
})

router.get("/count", async (req, res) => {
    const [count] = await getSoundCount()
    res.status(200).json(count['count(*)'])
});
//todo put tags, instruments, genre under single endpoint
router.get("/tags", async (req, res) => {
    const tags = []
    const tagsFetched = await getTags();
    // console.log(tagsFetched)
    tagsFetched.forEach(({
        tag_name
    }) => tags.push(tag_name))

    res.status(200).json(tags)
});
router.get("/instruments", async (req, res) => {
    const instruments = [];
    const instrumentsFetched = await getInstruments()
    instrumentsFetched.forEach(({
        instrument_name
    }) => instruments.push(instrument_name))
    res.status(200).json(instruments)
});
router.get("/genres", async (req, res) => {
    const genres = [];
    const genresFetched = await getGenre()
    genresFetched.forEach(({
        genre_name
    }) => genres.push(genre_name))
    res.status(200).json(genres)
});

// router.get("/column/:column", async (req, res) => {
//     const column = req.params.column;
//     const itemList = [];
//     const itemsFetched = await getColumn(column);
//     itemsFetched.forEach(({
//         column
//     }) => console.log(e))
//     // itemsFetched.forEach(({
//     //     column
//     // }) => tags ? tags.split(",").forEach(e => itemList.includes(e) ? null : itemList.push(e)) : null)
//     // console.log(itemsFetched)
//     // res.status(200).json(itemList)
//     // res.status(200).json(count['count(*)'])
// });

router.get("/stream/:key", (req, res) => {
    const key = req.params.key;
    console.log("/stream", key)
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
