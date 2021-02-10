// todo setup database to track downloads for songs ()
exports.up = function (knex) {
    return knex.schema.createTable("SoundDownload", tbl => {
        tbl.integer("id").primary();
        tbl.string("userId").notNullable().references("User.id");
        tbl.date("downloaded_at").notNullable()
        tbl.boolean("exclusive").default(false) //* account downloads color/has been downloaded or not
    })
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists("SoundDownload")
};
