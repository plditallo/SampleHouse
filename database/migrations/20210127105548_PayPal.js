exports.up = function (knex) {
    return knex.schema.createTable("PayPal", tbl => {
        tbl.increments().primary();
        tbl.date("created").notNullable();
        tbl.date("updated")
        tbl.string("transaction_id").notNullable();
        tbl.string("payment_status")
    })
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists("PayPal");
};
