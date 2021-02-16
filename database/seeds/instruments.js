  exports.seed = function (knex) {
      // Deletes ALL existing entries
      return knex('Instrument').del()
          .then(function () {
              // Inserts seed entries
              return knex('Instrument').insert([{
                      "id": 1,
                      "name": "drums",
                  },
                  {
                      "id": 2,
                      "name": "high hat",
                  },
                  {
                      "id": 3,
                      "name": "hats",
                  },
                  {
                      "id": 4,
                      "name": "piano",
                  },
                  {
                      "id": 5,
                      "name": "trop",
                  },
                  {
                      "id": 6,
                      "name": "vocal chop",
                  },
                  {
                      "id": 7,
                      "name": "vocal",
                  },
                  {
                      "id": 8,
                      "name": "marimba",
                  },
                  {
                      "id": 9,
                      "name": "flute",
                  }
              ]);
          });
  };
