// todo setup database to track downloads for songs ()
exports.up = function (knex) {
    return knex.schema.createTable("Sound", tbl => {
        tbl.increments("id").primary()
    })
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists("Sound")
};
