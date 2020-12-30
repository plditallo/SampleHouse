const db = require("../database-config");

module.exports = {
    insertSubscription,
    getSubscriberById,
    removeSubscription
}

function insertSubscription(data) {
    return db("Subscription").insert(data)
}

function getSubscriberById(user_id) {
    return db("Subscription").where({
        user_id
    })
}

function removeSubscription(id) {
    return db("Subscription").where({
        id
    }).del()
}
