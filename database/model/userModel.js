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

function getUserById(id) {
    return db("User").where({
        id
    })
}

function getUserByEmail(email) {
    return db("User").where({
        email
    })
}


function updateUser(id, user) {
    return db("User").update(user)
        .where({
            id
        })

}

function removeUser(id) {
    return db("User").where({
        id
    }).del();
}
