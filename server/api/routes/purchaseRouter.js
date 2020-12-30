const router = require("express").Router();
const stripe = require("stripe")(process.env.STRIPE_API_SECRET_KEY)
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
// const day = 1000
const day = 86400000
// todo change all "" + "" to `${}`
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

router.post("/credits", validateOffer, async (req, res) => {
    const {
        user,
        offer
    } = req;
    if (!user.stripe_id) {
        const customer = await stripe.customers.create({
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            description: 'My First Test Customer (created for API docs)'
        });
        user.stripe_id = customer.id
    }
    const invoiceItem = await stripe.invoiceItems.create({
        customer: user.stripe_id,
        price: offer.stripe_price_id,
    });
    const invoice = await stripe.invoices.create({
        customer: user.stripe_id,
        auto_advance: true, // auto-finalize this draft after ~1 hour
    });

    console.log({
        invoiceItem
    }, {
        invoice
    })


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
            return res.status(200).send({
                msg: `Purchase of: ${offer.name} was successful. ${offer.credits} tokens have been added to your account. Your balance is: ${user.balance}.`
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
