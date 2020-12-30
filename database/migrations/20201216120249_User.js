exports.up = function (knex) {
    // todo last logged in
    return knex.schema.createTable("User", (tbl) => {
        tbl.uuid("id").primary().unique();
        tbl.string("stripe_id")
        tbl.string("first_name");
        tbl.string("last_name");
        tbl.string("email").notNullable()
        tbl.boolean("isVerified").default(false)
        tbl.string("password").notNullable();
        tbl.string("password_reset_token")
        tbl.date("password_reset_expires")
        tbl.integer("balance").default(0);
        tbl.date("created").default(Date.now()); //knex.fn.now()
        tbl.boolean("active_subscription").default(false)
        tbl.date('last_login')
        tbl.string('role').default("user")
        tbl.boolean("auto_subscribe").default(true)
        tbl.string("currency").default("usd")
    })
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists("User")
};
