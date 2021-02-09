const db = require("../database-config");

module.exports = {
    insertDownload,
    getDownloadsByUser,
    checkDownloadByUser,
    getExclusiveDownloads,
    getSoundDownloadCount
}

function insertDownload(data) {
    return db("SoundDownload").insert(data)
}

function getDownloadsByUser(userId) {
    return db("SoundDownload").where({
        userId
    })
}

function checkDownloadByUser(userId, name) {
    return db("SoundDownload").where({
        userId,
        name
    })
}

function getExclusiveDownloads() {
    return db("SoundDownload").where({
        exclusive: true
    })
}

// function checkExclusiveDownload(name) {
//     return db("SoundDownload").where({
//         exclusive: true
//     })
// }

function getSoundDownloadCount(name) {
    return db("SoundDownload").where({
        name
    })
}
