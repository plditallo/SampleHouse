const db = require("../database-config");

module.exports = {
    insertSound,
    getSoundCount,
    getSounds,
    getSoundBy,
    getSoundsByTag,
    getTags,
    updateSound,
    removeSound
}

function insertSound(sound) {
    return db("Sound").insert(sound)
}

function getSoundCount() {
    return db("Sound").count()
}

function getSounds(limit, offset) {
    return db("Sound").limit(limit).offset(offset)
}

function getSoundBy(column, value) {
    return db("Sound").where(column, value)
}

function getSoundsByTag(limit, offset, tags) {
    // todo tags
    console.log(tags)
    tags = tags.split(",")
    switch (tags.length) {
        case 1:
            return "1";
        case 2:
            return "2";
        case 3:
            return "3";
        case 4:
            return "4";
        case 5:
            return "5";
        case 6:
            return "6";
        case 7:
            return "7";
    }

    // return db("Sound").limit(limit).offset(offset).where("tags", "like", `%${tags}%`)
    // // .whereIn("tags", [`%${tags}%`])

}

function getTags() {
    return db("Sound").select("tags")
}

function updateSound(sound) {
    return db("Sound").update(sound).where("id", sound.id)
}

function removeSound(id) {
    return db("Sound").where({
        id
    }).del();
}
