exports.up = function (knex) {
    return knex.schema.createTable("Genre", tbl => {
        tbl.increments("id").primary();
        tbl.string("genre_name")
    })
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists("Genre")
};
