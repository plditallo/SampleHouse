exports.up = function (knex) {
    return knex.schema.createTable("Offer", (tbl) => {
        tbl.increments("id").primary().unique()
        tbl.string("name")
        tbl.string("description")
        tbl.integer("credits").notNullable()
        tbl.string("product_type").default("offer")
        tbl.string("price")
        tbl.integer("discount")
        tbl.integer("tier").default(0)
    })
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists("Offer")
};
