const {
    getPlanByTier
} = require("../../../database/model/planModel");

module.exports = {
    validatePlan
};

function validatePlan(req, res, next) {
    const {
        tier
    } = req.body
    getPlanByTier(tier).then(([plan]) => {
        if (!plan) return res.status(400).json({
            msg: "No Plan found.",
        })
        req.plan = plan
        next()
    })
}
