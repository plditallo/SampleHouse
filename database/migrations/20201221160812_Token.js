exports.up = function (knex) {
    return knex.schema.createTable("Token", (tbl) => {
        tbl.string("userId").notNullable().references("User.id");
        tbl.string("token").notNullable();
        tbl.date("expiresAt").notNullable()
    })
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists("Token")
};
