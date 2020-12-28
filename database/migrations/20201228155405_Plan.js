exports.up = function (knex) {
    return knex.schema.createTable("Plan", (tbl) => {
        tbl.increments("id").primary().unique()
        tbl.integer("tier")
        tbl.integer("credits").notNullable()
        tbl.integer("length").default(30)
    })
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists("Plan")

};
