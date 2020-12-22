const userDb = require("../../../database/model/userModel");
const subDb = require("../../../database/model/subscriptionModel");

module.exports = {
    validateUser,
    validateSubscription
};


function validateUser(req, res, next) {
    const email = req.body.email
    userDb.getUserByEmail(email).then(([user]) => {
        if (user) next()
        else {
            res.status(400).json({
                msg: "No user found.",
            })
        }
    })
}

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
