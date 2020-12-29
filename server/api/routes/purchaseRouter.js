const router = require("express").Router();
const {
    validatePlan
} = require("../middleware/planMiddleware");

router.post("/subscribe", validatePlan, (req, res) => {
    const user_id = req.decodedToken.subject;
    const {
        plan_id
    } = req

    console.log(user_id, plan_id)



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
    res.status(200).json("token worked")
});


router.use("/", (req, res) => {
    res.status(200).json({
        Route: "Purchase Route up"
    });
});

module.exports = router;
