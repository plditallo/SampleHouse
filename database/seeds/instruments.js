  exports.seed = function (knex) {
      // Deletes ALL existing entries
      return knex('Instrument').del()
          .then(function () {
              // Inserts seed entries
              return knex('Instrument').insert([{
                      "id": 1,
                      "instrument_name": "drums",
                  },
                  {
                      "id": 2,
                      "instrument_name": "high hat",
                  },
                  {
                      "id": 3,
                      "instrument_name": "hats",
                  },
                  {
                      "id": 4,
                      "instrument_name": "piano",
                  },
                  {
                      "id": 5,
                      "instrument_name": "trop",
                  },
                  {
                      "id": 6,
                      "instrument_name": "vocal chop",
                  },
                  {
                      "id": 7,
                      "instrument_name": "vocal",
                  },
                  {
                      "id": 8,
                      "instrument_name": "marimba",
                  },
                  {
                      "id": 9,
                      "instrument_name": "flute",
                  }
              ]);
          });
  };
