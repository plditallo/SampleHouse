const db = require("../database-config");

module.exports = {
    insertTransaction,
    getTransaction,
    updateTransaction
}

function insertTransaction(transaction_id, payment_status) {
    return db("PayPal").insert({
        transaction_id,
        payment_status
    })
}

function getTransaction(transaction_id) {
    return db("PayPal").where({
        transaction_id
    })
}

function updateTransaction(transaction_id, payment_status) {
    return db("PayPal").update({
        payment_status
    }).where({
        transaction_id
    })
}
