exports.up = function (knex) {
    return knex.schema.createTable("Sound", tbl => {
        tbl.increments("id").primary();
        tbl.string("name").notNullable()
        tbl.string("pack").notNullable()
        tbl.string("type").notNullable()
        tbl.boolean("exclusive").notNullable()
        tbl.specificType('genre', 'text ARRAY')
        tbl.integer("tempo");
        tbl.integer("duration");
        tbl.string("key");
        tbl.specificType('instrument_type', 'text ARRAY')
        tbl.specificType('tags', 'text ARRAY')
        tbl.string("s3_uri").notNullable()
        tbl.integer("download_count").default(0)
        tbl.date("date_added").notNullable()
        tbl.date("date_modified");
    })
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists("Sound")
};
