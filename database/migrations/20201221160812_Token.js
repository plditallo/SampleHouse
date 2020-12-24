exports.up = function (knex) {
    return knex.schema.createTable("Token", (tbl) => {
        tbl.string("userId").notNullable().references("User.id");
        tbl.string("token").notNullable();
        tbl.date("expiresAt").notNullable().default(Date.now() + 43200000) //12hrs
    })
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists("Token")
};
