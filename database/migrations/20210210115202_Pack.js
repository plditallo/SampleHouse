exports.up = function (knex) {
    return knex.schema.createTable("Pack", tbl => {
        tbl.increments("id").primary();
        tbl.string("title");
        tbl.string("artist")
        tbl.string("description");
        tbl.specific_type("sound_tags")
    })
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists("Pack")
};
