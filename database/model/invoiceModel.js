const db = require("../database-config");

module.exports = {
    insertSubscription,
}

function insertSubscription(data) {
    return db("User").insert(data)
}
