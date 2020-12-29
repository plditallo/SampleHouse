const db = require("../database-config");

module.exports = {
    insertPlan,
    getPlanById,
    getPlanByTier,
    updatePlan,
    removePlan
}

function insertPlan(data) {
    return db("Plan").insert(data)
}

function getPlanById(id) {
    return db("Plan").where({
        id
    })
}

function getPlanByTier(tier) {
    return db("Plan").where({
        tier
    })
}

function updatePlan(tier, data) {
    return db("Plan").update(data)
        .where({
            tier
        })
}

function removePlan(id) {
    return db("Plan").where({
        id
    }).del();
}
