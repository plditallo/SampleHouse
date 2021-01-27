const router = require("express").Router();
const ipn = require("paypal-ipn");
const payPalDb = require("../../../database/model/payPalModel");
const offerDb = require("../../../database/model/offerModel");
const planDb = require("../../../database/model/planModel");

// 1. PayPal HTTPS POSTs an IPN message to your listener that notifies it of an event.
router.post("/", (req, res) => {
    let {
        txn_id,
        payment_status,
        receiver_email,
        item_number1,
        mc_currency,
        mc_gross
    } = req.body //! testing let -> const
    //! todo item_number or item_number1 for testing??
    console.log(req.body)
    // 2. Your listener returns an empty HTTP 200 response to PayPal.
    res.status(200).send("OK").end() //? chain on .end?
    // res.end()
    // 3. Your listener HTTPS POSTs the complete, unaltered message back to PayPal;
    ipn.verify(req.body, {
        'allow_sandbox': true
    }, function callback(err, msg) {
        // 4. PayPal sends a single word back - either VERIFIED (if the message matches the original) or INVALID (if the message does not match the original)
        if (err) {
            console.error(err);
        } else {
            console.log(msg)
            // 5. Verify that you are the intended recipient of the IPN message. To do this, check the email address in the message. //todo change this email
            if (receiver_email !== 'seller@paypalsandbox.com') return;

            // 6. Verify that the IPN is not a duplicate. To do this, save the transaction ID and last payment status in each IPN message in a database and verify that the current IPN's values for these fields are not already in this database.
            let existingSuccessIPN = false;
            txn_id = Math.random() * 100 //! testing
            payPalDb.getTransaction(txn_id).then(([resp]) => {
                if (resp) {
                    if (resp.payment_status === 'Completed') existingSuccessIPN = true
                    payPalDb.updateTransaction(txn_id, payment_status).then(existingSuccessIPN = false)
                } else
                    payPalDb.insertTransaction(txn_id, payment_status).then(existingSuccessIPN = false)
            })
            // 7. Check that the payment_status is Completed.
            // 8. If the payment_status is Completed, check the txn_id against the previous PayPal transaction that you processed to ensure the IPN message is not a duplicate.
            if (payment_status === 'Completed' && existingSuccessIPN === false) {
                //? 9. Check that the receiver_email is an email address registered in your PayPal account. (step 5???)
                // 10. Check that the price (carried in mc_gross) and the currency (carried in mc_currency) are correct for the item (carried in item_name or item_number).
                // todo item_number1 ??????
                item_number1 = "P-5NY36749SE7475025MAIOEJI" //!testing
                mc_gross = '5.99' //!testing

                planDb.getPlanByPayPalId(item_number1).then(([
                    plan
                ]) => {
                    if (!plan || mc_currency !== "USD" || mc_gross != plan.price) return console.log("false information")
                    else console.log("payment successful and verified")
                })
            }
        }
    }, process.env.NODE_ENV === 'production');
})
router.use("/", (req, res) => {
    res.status(200).json({
        Route: "PayPal Route"
    });
});


module.exports = router;
