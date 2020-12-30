exports.up = function (knex) {
    return knex.schema.createTable("Plan", (tbl) => {
        tbl.string("id").primary().unique()
        tbl.string("stripe_prod_id").unique()
        tbl.string("stripe_price_id").unique()
        tbl.string("name")
        tbl.string("description")
        tbl.integer("tier")
        tbl.integer("credits").notNullable()
        tbl.integer("price")
        tbl.integer("day_length").default(30)
        tbl.string("product_type").default("plan")
    })
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists("Plan")
};
