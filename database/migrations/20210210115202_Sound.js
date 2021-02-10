exports.up = function (knex) {
    return knex.schema.createTable("Sound", tbl => {
        tbl.increments("id").primary();
        tbl.string("name");
        tbl.string("pack");
        tbl.string("type");
        tbl.boolean("exclusive");
        tbl.specificType('genre', 'text ARRAY')
        tbl.integer("tempo");
        tbl.integer("duration");
        tbl.string("key");
        tbl.specificType('instrument_type', 'text ARRAY')
        tbl.specificType('tags', 'text ARRAY')
        tbl.string("s3_uri");
        tbl.integer("download_count");
        tbl.date("date_added");
        tbl.date("date_modified");

    })
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists("Sound")
};
