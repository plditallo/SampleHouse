exports.up = function (knex) {
    return knex.schema.createTable("Pack", tbl => {
        tbl.increments("id").primary();
        tbl.string("title");
        tbl.string("artist")
        tbl.string("description");
    })
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists("Pack")
};
