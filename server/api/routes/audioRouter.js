const router = require("express").Router();
const userDb = require("../../../database/model/userModel");
const downloadDb = require("../../../database/model/soundDownloadModel");
const {
    getSounds,
    getSoundsBy,
    searchSounds,
    getSoundCount,
    getColumn,
    getSoundById,
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
            instrument_type,
            searchQuery
    } = req.query;
    let filtering = false;
    if (tags || genres || instrument_type) filtering = true;
    const filters = {
        tags: tags ? tags.split(",") : [],
        genres: genres ? genres.split(",") : [],
        instrument_type: instrument_type ? instrument_type.split(",") : []
    }
    let sounds = []
    if (!filtering && !searchQuery) sounds = await getSounds(limit, offset)
    else if (filtering) {
        //! how to DRY???
        if (filters.tags.length) {
            const value = filters.tags[0];
            sounds = await getSoundsBy("tags", filters.tags[0])
            filters.tags = filters.tags.filter(e => e !== value)

        } else if (filters.genres.length) {
            const value = filters.genres[0];
            sounds = await getSoundsBy("genre", filters.genres[0])
            filters.genres = filters.genres.filter(e => e !== value)

        } else if (filters.instrument_type.length) {
            const value = filters.instrument_type[0];
            sounds = await getSoundsBy("instrument_type", filters.instrument_type[0])
            filters.instrument_type = filters.instrument_type.filter(e => e !== value)
        }
        Object.keys(filters).forEach(key => {
            if (filters[key].length) {
                const value = filters[key][0]
                filters[key] = filters[key].filter(e => e !== value)
                return sounds = sounds.filter(e => (e[key] && e[key].includes(value)))
            }
        })
    } else if (searchQuery) {
        const queries = searchQuery.split(" ");
        let i = 0;
        let searchedSounds = []
        console.log(queries)
        while (i < queries.length) {
            await searchSounds(queries[0]).then(res => res.forEach(e => {
                if (!searchedSounds.includes(e)) searchedSounds.push(e)
            }))
            i++;
        }
        sounds = searchedSounds
    }
    // console.log(sounds.length)
    // console.log({
    //     sounds
    // })
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
        const [sound] = await getSoundsBy("name", soundName)
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

router.get("/:id", async (req, res) => {
    const id = req.params.id;
    const sound = await getSoundById(id)
    if (sound) res.status(200).json(sound);
    else res.status(500)
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
    downloadStream.on('Error', () => res.status(404).send('Not Found').end())
    downloadStream.on('httpHeaders',
        (statusCode, headers, resp) =>
        res.set({
            'Content-Type': headers['content-type']
        }));
    return downloadStream
}
