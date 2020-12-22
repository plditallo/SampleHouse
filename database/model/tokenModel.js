const db = require("../database-config");

module.exports = {
    insert
}

function insert(token) {
    return db("Token").insert(token)
}

function getUsers() {
    return db("Token")
}

function getUserByEmail(email) {
    return db("Token").where({
        email
    })
}

function getUserById(id) {
    return db("Token").where({
        id
    })
}

function updateUser(id, data) {
    return db("Token").update(data)
        .where({
            id
        })

}

function removeUser(id) {
    return db("Token").where({
        id
    }).del();
}
