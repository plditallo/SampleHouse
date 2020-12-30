const router = require("express").Router();
const {
    validatePlan,
    validateOffer
} = require("../middleware/purchaseMiddleware");
const {
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
// const day = 86400000
const day = 1000
//todo purchase history, no duplicate downloads
router.post("/subscribe", validatePlan, (req, res) => {
    const {
        user,
        plan
    } = req;

    getSubscriberById(user.id).then(([subscriber]) => {
        const subscriptionData = {
            user_id: user.id,
            plan_id: plan.id,
            subscribe_start: Date.now(),
            subscribe_end: Date.now() + (day * plan.day_length)
        }
        // console.log((subscriber && (subscriber.subscribe_end - Date.now()) > day / 2))
        //* check if subscriber has MORE than 24 hours left on subscription
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
});

router.post("/currency", validateOffer, (req, res) => {
    const {
        user,
        offer
    } = req;
    getSubscriberById(user.id).then(([subscriber]) => {
        //* check if subscriber has LESS than 24 hours left on subscription
        if (!subscriber || (subscriber && (subscriber.subscribe_end - Date.now()) < day)) {
            if (subscriber) removeSubscription(subscriber.id).then(null)
            return res.status(200).send({
                msg: "User doesn't have an active subscription."
            })
        }
        if (paymentResponse = true) {
            createInvoice(user, offer)
            res.status(200).send({
                msg: "Purchase of: " + offer.name + " was successful. " + offer.credits + "tokens have been added to your account. Your new balance is: " + user.balance + " ."
            })
        }
        console.log("payment failed at new subscriber")
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
