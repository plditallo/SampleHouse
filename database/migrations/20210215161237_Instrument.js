exports.up = function (knex) {
    return knex.schema.createTable("Instrument", tbl => {
        tbl.increments("id").primary();
        tbl.string("instrument_name")
    })
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists("Instrument")
};
