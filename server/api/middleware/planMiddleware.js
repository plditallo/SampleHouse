const userDb = require("../../../database/model/userModel");
const {
    getPlanByTier
} = require("../../../database/model/planModel");

module.exports = {
    validatePlan
};


function validatePlan(req, res, next) {
    const tier = req.body.plan
    getPlanByTier(tier).then(([sub]) => {
        if (sub) next()
        else {
            res.status(400).json({
                msg: "No Plan found.",
            })
        }
    })
}

function validateHeaders(req, res, next) {
    console.log(req.body)
    next()
}
