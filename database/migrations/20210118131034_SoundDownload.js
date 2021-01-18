// todo setup database to track downloads for songs ()
exports.up = function (knex) {
    return knex.schema.createTable("SoundDownload", tbl => {
        tbl.increments("id").primary();
        tbl.string("name").notNullable();
        tbl.string("userId").notNullable().references("User.id");
        tbl.date("download_at").notNullable()
        tbl.boolean("exclusive").default(false)
    })
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists("SoundDownload")
};
