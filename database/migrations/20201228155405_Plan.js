exports.up = function (knex) {
    return knex.schema.createTable("Plan", (tbl) => {
        tbl.string("id").primary().unique()
        tbl.string("payPal_id").unique()
        tbl.string("name").notNullable()
        tbl.string("description")
        tbl.integer("tier")
        tbl.integer("credits").notNullable()
        tbl.string("price").notNullable()
        tbl.integer("day_length").default(30)
        tbl.string("product_type").default("plan")
        tbl.specificType('included', 'text ARRAY')
        tbl.integer("discount")
    })
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists("Plan")
};
