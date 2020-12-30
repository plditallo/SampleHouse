const db = require("../database-config");

module.exports = {
    getOfferById,
}

function getOfferById(id) {
    return db("Offer").where({
        id
    })
}
