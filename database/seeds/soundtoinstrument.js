exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex('SoundToInstrument').del()
        .then(function () {
            // Inserts seed entries
            return knex('SoundToInstrument').insert([{
                    "sound_id": 1,
                    "instrument_id": 1
                },
                {
                    "sound_id": 1,
                    "instrument_id": 2
                }, {
                    "sound_id": 1,
                    "instrument_id": 3
                }, {
                    "sound_id": 2,
                    "instrument_id": 1
                }, {
                    "sound_id": 3,
                    "instrument_id": 1
                }, {
                    "sound_id": 4,
                    "instrument_id": 4
                }, {
                    "sound_id": 5,
                    "instrument_id": 4
                }, {
                    "sound_id": 5,
                    "instrument_id": 5
                }, {
                    "sound_id": 5,
                    "instrument_id": 6
                }, {
                    "sound_id": 7,
                    "instrument_id": 8
                }, {
                    "sound_id": 7,
                    "instrument_id": 7
                }, {
                    "sound_id": 9,
                    "instrument_id": 9
                }, {
                    "sound_id": 9,
                    "instrument_id": 1
                }, {
                    "sound_id": 10,
                    "instrument_id": 9
                }, {
                    "sound_id": 11,
                    "instrument_id": 9
                },
            ]);
        });
};
