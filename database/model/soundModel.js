const db = require("../database-config");

module.exports = {
    insertSound,
    getSounds,
    getSoundBy,
    updateSound,
    removeSound
}

function insertSound(sound) {
    return db("Sound").insert(sound)
}

function getSounds(limit, offset) {
    return db("Sound").limit(limit).offset(offset)
}

function getSoundBy(column, value) {
    return db("Sound").where(column, value)
}

function updateSound(sound) {
    return db("Sound").update(sound).where("id", sound.id)
}

function removeSound(id) {
    return db("Sound").where({
        id
    }).del();
}
