exports.up = function (knex) {
    return knex.schema.createTable("Subscription", (tbl) => {
        tbl.increments("id").primary().unique()
        tbl.integer("tier").notNullable() //todo integer?
        tbl.integer("credits").notNullable()
        tbl.integer("length").default(30)
    })
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists("Subscription")

};
