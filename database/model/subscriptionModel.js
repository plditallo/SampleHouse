const db = require("../database-config");

module.exports = {
    insertSub,
    getSub,
    getSubById,
    updateSub,
    removeSub
}

function insertSub(data) {
    return db("User").insert(data)
}

function getSub() {
    return db("User")
}

function getSubById(id) {
    return db("User").where({
        id
    })
}

function updateSub(id, data) {
    return db("User").update(data)
        .where({
            id
        })

}

function removeSub(id) {
    return db("User").where({
        id
    }).del();
}
