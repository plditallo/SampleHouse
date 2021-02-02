exports.up = function (knex) {
    return knex.schema.createTable("User", tbl => {
        tbl.uuid("id").primary().unique();
        tbl.string("first_name");
        tbl.string("last_name");
        tbl.string("email").notNullable()
        tbl.boolean("isVerified").default(false)
        tbl.boolean("active_subscription").default(false)
        tbl.integer("balance").default(0);
        tbl.string("password").notNullable();
        tbl.string("password_reset_token")
        tbl.date("password_reset_expires")
        tbl.date("created") //knex.fn.now()
        tbl.date('last_login')
        tbl.string('role').default("user")
        tbl.string("currency").default("USD")
        tbl.string("vst_access").default(false)
        tbl.string("payPal_subscription_id");
    })
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists("User")
};
