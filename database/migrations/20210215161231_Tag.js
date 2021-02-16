exports.up = function (knex) {
    return knex.schema.createTable("Tag", tbl => {
        tbl.increments("id").primary();
        tbl.string("tag_name")
    })
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists("Tag")
};
