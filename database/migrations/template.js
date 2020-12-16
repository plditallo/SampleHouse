exports.up = function (knex) {
    return knex.schema.createTable("TableName", (tbl) => {
        tbl.increments("id").primary();
        tbl.string("columnName").notNullable();
    })
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists("TableName")
};
