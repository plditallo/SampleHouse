const db = require("../database-config");

module.exports = {
    getPlans,
    insertPlan,
    getPlanById,
    getPlanByTier,
    getPlanByPayPalId,
    updatePlan,
    removePlan
}

function getPlans() {
    return db("Plan")
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

function getPlanByPayPalId(payPal_id) {
    return db("Plan").where({
        payPal_id
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
