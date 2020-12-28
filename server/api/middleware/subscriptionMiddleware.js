const userDb = require("../../../database/model/userModel");
const subDb = require("../../../database/model/subscriptionModel");

module.exports = {
    validateSubscription
};


function validateSubscription(req, res, next) {
    const tier = req.body.subscription
    subDb.getSubByTier(tier).then(([sub]) => {
        if (sub) next()
        else {
            res.status(400).json({
                msg: "No Subscription found.",
            })
        }
    })
}

function validateHeaders(req, res, next) {
    console.log(req.body)
    next()
}
