exports.up = function (knex) {
    return knex.schema.createTable("SoundToInstrument", tbl => {
        tbl.integer("id").primary();
        tbl.integer("sound_id").references("Sound.id")
        tbl.integer("instrument_id").references("Instrument.id")
    })
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists("SoundToInstrument")
};
