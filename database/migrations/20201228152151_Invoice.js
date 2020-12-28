exports.up = function (knex) {
    return knex.schema.createTable("Invoice", (tbl) => {
        tbl.increments("id").primary()
        tbl.uuid("user_id").references("User.id").notNullable();
        tbl.integer("plan_id").references("Plan.id")
        tbl.integer("offer_id").references("Offer.id")
        tbl.string("type")
        tbl.integer("amount")
        tbl.date("created").default(Date.now())
    })
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists("Invoice")

};
