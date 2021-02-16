  exports.seed = function (knex) {
      // Deletes ALL existing entries
      return knex('Genre').del()
          .then(function () {
              // Inserts seed entries
              return knex('Genre').insert([{
                      "id": 1,
                      "name": "pop",
                  },
                  {
                      "id": 2,
                      "name": "tropical",
                  },
                  {
                      "id": 3,
                      "name": "tropical house",
                  },
                  {
                      "id": 4,
                      "name": "trap",
                  },
              ]);
          });
  };
