exports.up = function (knex) {
    return knex.schema.createTable("User", (tbl) => {
        tbl.increments("id").primary(); //todo set tbl.uuid("id").primary().unique()
        tbl.string("fname");
        tbl.string("lname");
        tbl.string("email").notNullable()
        tbl.string("password").notNullable();
        tbl.integer("balance").default(0);
        tbl.date("created").default(knex.fn.now()); //todo change to a date Date.now()
        tbl.date("subDate")
        tbl.string("tier").references("Subscription.tier")
    })
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists("User")
};
