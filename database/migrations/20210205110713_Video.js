exports.up = function (knex) {
    return knex.schema.createTable("Video", tbl => {
        tbl.increments("id")
        tbl.string("title").notNullable();
        tbl.string("description").notNullable();
        tbl.string("url").notNullable();
    })
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists("Video");
};
