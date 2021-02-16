  exports.seed = function (knex) {
      // Deletes ALL existing entries
      return knex('Tag').del()
          .then(function () {
              // Inserts seed entries
              return knex('Tag').insert([{
                      "id": 1,
                      "name": "closed hat",
                  },
                  {
                      "id": 2,
                      "name": "hats",
                  },
                  {
                      "id": 3,
                      "name": "hh",
                  },
                  {
                      "id": 4,
                      "name": "pluck",
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
                      "name": "lofi",
                  },
                  {
                      "id": 8,
                      "name": "woodwind",
                  },
                  {
                      "id": 9,
                      "name": "tropical",
                  },
              ]);
          });
  };
