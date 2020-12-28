const router = require("express").Router();
const {
    getUserByEmail
} = require("../../../database/model/userModel");
const {
    getSubByTier
} = require('../../../database/model/subscriptionModel');

const {
    validateUser,
    validateSubscription
} = require("../middleware/subscriptionMiddleware");
const {
    body,
    validationResult
} = require('express-validator');

router.post("/subscribe",
    //  [body('email').isEmail().normalizeEmail()],
    validateSubscription, (req, res) => {
        const {
            email,
            subscription
        } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).send(errors.array());
        console.log("subscription route", email)
        //     getUserByEmail(email).then(([user]) => {
        //         getSubByTier(subscription).then(([sub]) => {
        //             // console.log(user.subDate)
        //             // todo check for current sub and add 30 days
        //             const data = {
        //                 "subDate": Date.now(),
        //                 "balance": user.balance + sub.credits,
        //                 "tier": sub.tier
        //             }
        //             userDb.updateUser(user.id, data).then(resp => res.status(201).json(resp)).catch(err => res.status(403).json(err))
        //         })
        //     })
    });


router.use("/", (req, res) => {
    res.status(200).json({
        Route: "Purchase Route up"
    });
});

module.exports = router;
