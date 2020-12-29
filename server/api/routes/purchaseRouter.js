const router = require("express").Router();
const {
    validatePlan
} = require("../middleware/planMiddleware");
const {
    getUserById,
    updateUser
} = require("../../../database/model/userModel")
const {
    insertSubscription,
    getSubscriberById,
    updateSubscription
} = require("../../../database/model/subscriptionModel")
const day = 86400000

router.post("/subscribe", validatePlan, (req, res) => {
    const user_id = req.decodedToken.subject;
    const plan = req.plan

    getUserById(user_id).then(([user]) => {
        if (!user) return res.status(403).json({
            msg: 'The user ID: ' + user_id + ' is not associated with any account.'
        });
        getSubscriberById(user_id).then(subscriber => {
            const subscriptionData = {
                user_id: user.id,
                plan_id: plan.id,
                subscribe_start: Date.now(),
                subscribe_end: Date.now() + (day * plan.day_length)
            }
            if (!subscriber) {
                if (paymentResponse = true) insertSubscription(subscriptionData).then((resp) => {
                    updateUserBalance(user, plan.credits)
                    console.log("new subscription", resp)
                })
                console.log("payment failed")
            }
            //* user has active subscription
            if ((subscriber.subscribe_end - Date.now()) > 0)
                return res.status(200).send({
                    msg: "User already has an active subscription. Subscription expires on: " + subscriber.subscribe_end.toLocaleDateString() + "."
                })
            if (paymentResponse = true) {
                updateSubscription(subscriptionData).then(resp => {
                    updateUserBalance(user, plan.credits)
                    console.log("subscription updated", resp)
                })
            }
            console.log("payment failed")
        })
    })
    res.status(200).json("token worked")
});


router.use("/", (req, res) => {
    res.status(200).json({
        Route: "Purchase Route up"
    });
});

module.exports = router;

function updateUserBalance(user, credits) {
    user.active = true
    user.balance += credits
    updateUser(user).then(resp => console.log("null", "updateUserBalance", user, resp))
}

// todo find different term for productl
function createInvoice(user, product) {
    const invoice = {
        user_id: user.id,

    }
}
