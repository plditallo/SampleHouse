exports.up = function (knex) {
    return knex.schema.createTable("Sound", tbl => {
        // refactor to include pack as references
        tbl.increments("id").primary();
        tbl.string("name").notNullable().unique();
        tbl.string("pack").references("Pack.id");
        tbl.string("type");
        tbl.boolean("exclusive");
        tbl.specificType('genre', 'text ARRAY'); //!single table
        tbl.integer("tempo");
        tbl.integer("duration");
        tbl.string("key");
        tbl.specificType('instrument_type', 'text ARRAY'); //!single table
        tbl.specificType('tags', 'text ARRAY'); //!single table
        tbl.string("s3_uri").notNullable().unique();
        tbl.integer("download_count").default(0);
        tbl.date("date_added");
        tbl.date("date_modified");
    })
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists("Sound")
};
