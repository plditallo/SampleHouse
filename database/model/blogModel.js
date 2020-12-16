const db = require("../database-config");

module.exports = {
    insertData,
    getData,
    getDataById,
    updateData,
    removeData
}

function insertData(data) {
    return db("tableName").insert(data)
}

function getData() {
    return db("tableName")
}

function getDataById(id) {
    return db("tableName").where({
        id
    })
}

function updateData(id, Data) {
    return db("tableName").update(Data)
        .where({
            id
        })

}

function removeData(id) {
    return db("tableName").where({
        id
    }).del();
}
