const createInvoice = require("./createInvoice");
const {
    insertSubscription,
    getSubscriberById,
    removeSubscription
} = require("../../../database/model/subscriptionModel");
const day = 86400000;

module.exports = {subscribe}

function subscribe(user, plan){

}
