const router = require("express").Router();
const {
    getUserByEmail
} = require("../../../database/model/userModel");
const {
    getPlanByTier
} = require('../../../database/model/planModel');

const {
    validatePlan
} = require("../middleware/planMiddleware");
const {
    body,
    validationResult
} = require('express-validator');

router.post("/subscribe",
    //  [body('email').isEmail().normalizeEmail()],
    validatePlan, (req, res) => {
        const {
            email,
            plan
        } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).send(errors.array());
        console.log("subscription route", email)
        //     getUserByEmail(email).then(([user]) => {
        //         getPlanByTier(subscription).then(([sub]) => {
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
