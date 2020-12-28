exports.up = function (knex) {
    return knex.schema.createTable("User", (tbl) => {
        tbl.uuid("id").primary().unique();
        tbl.string("fname");
        tbl.string("lname");
        tbl.string("email").notNullable()
        tbl.boolean("isVerified").default(false)
        tbl.string("password").notNullable();
        tbl.string("passwordResetToken")
        tbl.date("passwordResetExpires")
        tbl.integer("balance").default(0);
        tbl.date("created").default(Date.now()); //knex.fn.now()
        tbl.date("subDate")
        tbl.string("tier").references("Subscription.tier")
        tbl.string('role').default("user")
    })
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists("User")
};
