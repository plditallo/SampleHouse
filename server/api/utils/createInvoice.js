const {
    updateUser
} = require("../../../database/model/userModel")
const {
    insertInvoice
} = require("../../../database/model/invoiceModel");

module.exports = createInvoice;

function createInvoice(user, product) {
    const user_id = user.id
    const {
        id,
        product_type,
        price,
        credits,
        tier
    } = product

    user.active_subscription = true
    user.balance += credits
    if (tier > 1) user.vst_access = true
    else user.vst_access = false

    updateUser(user).then(null)
    insertInvoice({
        user_id,
        product_type,
        product_id: id,
        amount: price, //? does this save as int or str
        created: Date.now(),
        // description:
    }).then(null)
}
