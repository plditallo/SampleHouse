exports.up = function (knex) {
    return knex.schema.createTable("Offer", (tbl) => {
        tbl.increments("id").primary().unique()
        tbl.integer("credits").notNullable()
        tbl.string("product_type").default("offer")
        tbl.integer("price")
    })
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists("Offer")
};
