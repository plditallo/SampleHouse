const {
    getPlanById
} = require("../../../database/model/planModel");
const {
    getOfferById
} = require("../../../database/model/offerModel");

module.exports = {
    validatePlan,
    validateOffer
};

function validatePlan(req, res, next) {
    const {
        id
    } = req.body
    getPlanById(id).then(([plan]) => {
        if (!plan) return res.status(400).json({
            msg: `No Plan found with ID: ${id}.`,
        })
        req.plan = plan
        next()
    })
}

function validateOffer(req, res, next) {
    const {
        id
    } = req.body
    getOfferById(id).then(([offer]) => {
        if (!offer) return res.status(400).json({
            msg: `No offer found with ID: ${id}.`,
        })
        req.offer = offer
        next()
    })
}
