const db = require("../database-config");

module.exports = {
    getTags,
    getInstruments,
    getGenre
}

function getTags() {
    return db("Tag")
}

function getInstruments(){
    return db("Instrument")
}

function getGenre(){
    return db("Genre")
}
