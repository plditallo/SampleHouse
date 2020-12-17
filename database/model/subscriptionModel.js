const db = require("../database-config");

module.exports = {
    insertSub,
    getSubs,
    getSubByTier,
    updateSub,
    removeSub
}

function insertSub(data) {
    return db("Subscription").insert(data)
}

function getSubs() {
    return db("Subscription")
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
