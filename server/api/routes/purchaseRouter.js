const router = require("express").Router();
const {
    validatePlan,
    validateOffer
} = require("../middleware/purchaseMiddleware");
const {
    getUserById,
    updateUser
} = require("../../../database/model/userModel")
const {
    insertSubscription,
    getSubscriberById,
    removeSubscription
} = require("../../../database/model/subscriptionModel");
const {
    insertInvoice
} = require("../../../database/model/invoiceModel");
const day = 86400000
// const day = 500
//todo purchase history, no duplicate downloads
router.post("/subscribe", validatePlan, (req, res) => {
    const user_id = req.decodedToken.subject;
    const plan = req.plan

    getUserById(user_id).then(([user]) => {
        if (!user) return res.status(403).json({
            msg: 'The user ID: ' + user_id + ' is not associated with any account.'
        });
        getSubscriberById(user_id).then(([subscriber]) => {
            const subscriptionData = {
                user_id: user.id,
                plan_id: plan.id,
                subscribe_start: Date.now(),
                subscribe_end: Date.now() + (day * plan.day_length)
            }
            // console.log((subscriber && (subscriber.subscribe_end - Date.now()) > day / 2))
            if (subscriber && (subscriber.subscribe_end - Date.now()) > day)
                return res.status(200).send({
                    msg: "User already has an active subscription. Subscription expires on: " + new Date(subscriber.subscribe_end).toLocaleDateString() + "."
                })
            else if (subscriber) removeSubscription(subscriber.id).then(null)

            if (paymentResponse = true) return insertSubscription(subscriptionData).then(() => {
                createInvoice(user, plan)
                res.status(200).send({
                    msg: "Subscription to: " + plan.name + " was successful."
                })
            })
            console.log("payment failed at new subscriber")
        })
    })
});

router.post("/currency", validateOffer, (req, res) => {
    res.status(200).send({
        msg: "currency route",
        offer: req.offer
    })
})


router.use("/", (req, res) => {
    res.status(200).json({
        Route: "Purchase Route up"
    });
});

module.exports = router;

function createInvoice(user, product) {
    const user_id = user.id
    const {
        id,
        product_type,
        price,
        credits
    } = product

    user.active_subscription = true
    user.balance += credits

    updateUser(user).then(null)
    insertInvoice({
        user_id,
        product_type,
        product_id: id,
        amount: price,
        created: Date.now(),
        // description: 
    }).then(null)
}
