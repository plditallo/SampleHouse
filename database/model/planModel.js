const db = require("../database-config");

module.exports = {
    insertSub,
    getPlanByTier,
    updateSub,
    removeSub
}

function insertSub(data) {
    return db("Plan").insert(data)
}

function getPlanByTier(tier) {
    return db("Plan").where({
        tier
    })
}

function updateSub(tier, data) {
    return db("Plan").update(data)
        .where({
            tier
        })

}

function removeSub(tier) {
    return db("Plan").where({
        tier
    }).del();
}
