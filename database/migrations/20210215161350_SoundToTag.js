exports.up = function (knex) {
    return knex.schema.createTable("SoundToTag", tbl => {
        tbl.integer("id").primary();
        tbl.integer("sound_id").references("Sound.id")
        tbl.integer("tag_id").references("Tag.id")
    })
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists("SoundToTag")
};
