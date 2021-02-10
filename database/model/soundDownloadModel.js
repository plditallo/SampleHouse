const db = require("../database-config");

module.exports = {
    insertDownload,
    getDownloadsByUser,
    checkDownloadByUser,
    checkExclusiveDownload,
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

function checkDownloadByUser(userId, id) {
    return db("SoundDownload").where({
        userId,
        id
    })
}

function checkExclusiveDownload(id) {
    return db("SoundDownload").where(id)
}

function getSoundDownloadCount(id) {
    return db("SoundDownload").where({
        id
    })
}
