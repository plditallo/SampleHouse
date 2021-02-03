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

    if (product_type === "plan") {
        user.active_subscription = true
        if (tier > 1) user.vst_access = true
        else user.vst_access = false
    }

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
    console.log(`Invoice created for ${product.name} was successful.`)
}
