exports.up = function (knex) {
    return knex.schema.createTable("SoundToGenre", tbl => {
        tbl.increments("id").primary()
        tbl.integer("sound_id").references("Sound.id")
        tbl.integer("genre_id").references("Genre.id")
    })
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists("SoundToGenre")
};
