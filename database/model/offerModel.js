const db = require("../database-config");

module.exports = {
    getOfferById,
    getOfferByName
}


function getOfferById(id) {
    return db("Offer").where({
        id
    })
}

function getOfferByName(name) {
    return db("Offer").where({
        name
    })
}
