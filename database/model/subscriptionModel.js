const db = require("../database-config");

module.exports = {
    insertSub,
    getSubByTier,
    updateSub,
    removeSub
}

function insertSub(data) {
    return db("Subscription").insert(data)
}

function getSubByTier(tier) {
    return db("Subscription").where({
        tier
    })
}

function updateSub(tier, data) {
    return db("Subscription").update(data)
        .where({
            tier
        })

}

function removeSub(tier) {
    return db("Subscription").where({
        tier
    }).del();
}
