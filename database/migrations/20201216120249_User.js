exports.up = function (knex) {
    return knex.schema.createTable("User", (tbl) => {
        tbl.uuid("id").primary().unique();
        tbl.string("first_name");
        tbl.string("last_name");
        tbl.string("email").notNullable()
        tbl.boolean("isVerified").default(false)
        tbl.string("password").notNullable();
        tbl.string("password_reset_token")
        tbl.date("password_reset_expires")
        tbl.integer("balance").default(0);
        tbl.date("created").default(Date.now()); //knex.fn.now()
        tbl.boolean("active").default(false)
        tbl.string('role').default("user")
    })
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists("User")
};
