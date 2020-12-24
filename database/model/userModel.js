const db = require("../database-config");

module.exports = {
    insertUser,
    getUserById,
    getUserByEmail,
    updateUser,
    removeUser
}

function insertUser(data) {
    return db("User").insert(data)
}

function getUserByEmail(email) {
    return db("User").where({
        email
    })
}

function getUserById(id) {
    return db("User").where({
        id
    })
}

function updateUser(id, data) {
    return db("User").update(data)
        .where({
            id
        })

}

function removeUser(id) {
    return db("User").where({
        id
    }).del();
}
