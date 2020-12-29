const db = require("../database-config");

module.exports = {
    insertSubscription,
    getSubscriberById,
    updateSubscription
}

function insertSubscription(data) {
    return db("Subscription").insert(data)
}

function getSubscriberById(user_id) {
    return db("subscription").where({
        user_id
    })
}

function updateSubscription(data) {
    return db("subscription").update(data).where(
        data.user_id
    )
}
