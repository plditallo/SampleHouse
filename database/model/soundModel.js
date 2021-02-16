const db = require("../database-config");

module.exports = {
    insertSound,
    getSoundCount,
    getSounds,
    getSoundBy,
    getSoundsByTag,
    getColumn,
    updateSound,
    removeSound
}
//! .whereIn and LIKE for search functionality
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

function getColumn(column) {
    return db("Sound").select(column)
}

function updateSound(sound) {
    return db("Sound").update(sound).where("id", sound.id)
}

function removeSound(id) {
    return db("Sound").where({
        id
    }).del();
}


function getSoundsByTag(tags) {
    // todo refactor this...
    console.log(tags) // tags = "tag1,tag2,tag3"
    tags = tags.split(",") // tags = ["tag1","tag2","tag3"]
    switch (tags.length) {
        case 1:
            return db("Sound").where("tags", "like", `%${tags}%`).orWhere("instrument_type", "like", `%${tags}%`)
        case 2:
            return db("Sound")
                .where("tags", "like", `%${tags[0]}%`).orWhere("instrument_type", "like", `%${tags[0]}%`)
                .where("tags", "like", `%${tags[1]}%`).orWhere("instrument_type", "like", `%${tags[1]}%`)
        case 3:
            return db("Sound")
                .where("tags", "like", `%${tags[0]}%`).orWhere("instrument_type", "like", `%${tags[0]}%`)
                .where("tags", "like", `%${tags[1]}%`).orWhere("instrument_type", "like", `%${tags[1]}%`)
                .where("tags", "like", `%${tags[2]}%`)
        case 4:
            return db("Sound")
                .where("tags", "like", `%${tags[0]}%`).orWhere("instrument_type", "like", `%${tags[0]}%`)
                .where("tags", "like", `%${tags[1]}%`).orWhere("instrument_type", "like", `%${tags[1]}%`)
                .where("tags", "like", `%${tags[2]}%`)
                .where("tags", "like", `%${tags[3]}%`)
        case 5:
            return db("Sound")
                .where("tags", "like", `%${tags[0]}%`).orWhere("instrument_type", "like", `%${tags[0]}%`)
                .where("tags", "like", `%${tags[1]}%`).orWhere("instrument_type", "like", `%${tags[1]}%`)
                .where("tags", "like", `%${tags[2]}%`)
                .where("tags", "like", `%${tags[3]}%`)
                .where("tags", "like", `%${tags[4]}%`)
        case 6:
            return db("Sound")
                .where("tags", "like", `%${tags[0]}%`).orWhere("instrument_type", "like", `%${tags[0]}%`)
                .where("tags", "like", `%${tags[1]}%`).orWhere("instrument_type", "like", `%${tags[1]}%`)
                .where("tags", "like", `%${tags[2]}%`).orWhere("instrument_type", "like", `%${tags[2]}%`)
                .where("tags", "like", `%${tags[3]}%`).orWhere("instrument_type", "like", `%${tags[3]}%`)
                .where("tags", "like", `%${tags[4]}%`).orWhere("instrument_type", "like", `%${tags[4]}%`)
                .where("tags", "like", `%${tags[5]}%`).orWhere("instrument_type", "like", `%${tags[5]}%`)
        case 7:
            return db("Sound")
                .where("tags", "like", `%${tags[0]}%`).orWhere("instrument_type", "like", `%${tags[0]}%`)
                .where("tags", "like", `%${tags[1]}%`).orWhere("instrument_type", "like", `%${tags[1]}%`)
                .where("tags", "like", `%${tags[2]}%`).orWhere("instrument_type", "like", `%${tags[2]}%`)
                .where("tags", "like", `%${tags[3]}%`).orWhere("instrument_type", "like", `%${tags[3]}%`)
                .where("tags", "like", `%${tags[4]}%`).orWhere("instrument_type", "like", `%${tags[4]}%`)
                .where("tags", "like", `%${tags[5]}%`).orWhere("instrument_type", "like", `%${tags[5]}%`)
                .where("tags", "like", `%${tags[6]}%`).orWhere("instrument_type", "like", `%${tags[6]}%`)
        case 8:
            return db("Sound")
                .where("tags", "like", `%${tags[0]}%`).orWhere("instrument_type", "like", `%${tags[0]}%`)
                .where("tags", "like", `%${tags[1]}%`).orWhere("instrument_type", "like", `%${tags[1]}%`)
                .where("tags", "like", `%${tags[2]}%`).orWhere("instrument_type", "like", `%${tags[2]}%`)
                .where("tags", "like", `%${tags[3]}%`).orWhere("instrument_type", "like", `%${tags[3]}%`)
                .where("tags", "like", `%${tags[4]}%`).orWhere("instrument_type", "like", `%${tags[4]}%`)
                .where("tags", "like", `%${tags[5]}%`).orWhere("instrument_type", "like", `%${tags[5]}%`)
                .where("tags", "like", `%${tags[6]}%`).orWhere("instrument_type", "like", `%${tags[6]}%`)
                .where("tags", "like", `%${tags[7]}%`).orWhere("instrument_type", "like", `%${tags[7]}%`)
        case 9:
            return db("Sound")
                .where("tags", "like", `%${tags[0]}%`).orWhere("instrument_type", "like", `%${tags[0]}%`)
                .where("tags", "like", `%${tags[1]}%`).orWhere("instrument_type", "like", `%${tags[1]}%`)
                .where("tags", "like", `%${tags[2]}%`).orWhere("instrument_type", "like", `%${tags[2]}%`)
                .where("tags", "like", `%${tags[3]}%`).orWhere("instrument_type", "like", `%${tags[3]}%`)
                .where("tags", "like", `%${tags[4]}%`).orWhere("instrument_type", "like", `%${tags[4]}%`)
                .where("tags", "like", `%${tags[5]}%`).orWhere("instrument_type", "like", `%${tags[5]}%`)
                .where("tags", "like", `%${tags[6]}%`).orWhere("instrument_type", "like", `%${tags[6]}%`)
                .where("tags", "like", `%${tags[7]}%`).orWhere("instrument_type", "like", `%${tags[7]}%`)
                .where("tags", "like", `%${tags[8]}%`).orWhere("instrument_type", "like", `%${tags[8]}%`)
        case 10:
            return db("Sound")
                .where("tags", "like", `%${tags[0]}%`).orWhere("instrument_type", "like", `%${tags[0]}%`)
                .where("tags", "like", `%${tags[1]}%`).orWhere("instrument_type", "like", `%${tags[1]}%`)
                .where("tags", "like", `%${tags[2]}%`).orWhere("instrument_type", "like", `%${tags[2]}%`)
                .where("tags", "like", `%${tags[3]}%`).orWhere("instrument_type", "like", `%${tags[3]}%`)
                .where("tags", "like", `%${tags[4]}%`).orWhere("instrument_type", "like", `%${tags[4]}%`)
                .where("tags", "like", `%${tags[5]}%`).orWhere("instrument_type", "like", `%${tags[5]}%`)
                .where("tags", "like", `%${tags[6]}%`).orWhere("instrument_type", "like", `%${tags[6]}%`)
                .where("tags", "like", `%${tags[7]}%`).orWhere("instrument_type", "like", `%${tags[7]}%`)
                .where("tags", "like", `%${tags[8]}%`).orWhere("instrument_type", "like", `%${tags[8]}%`)
                .where("tags", "like", `%${tags[9]}%`).orWhere("instrument_type", "like", `%${tags[9]}%`)
    }

    return db("Sound").limit(limit).offset(offset).where("tags", "like", `%${tags}%`)
    // // .whereIn("tags", [`%${tags}%`])
}
