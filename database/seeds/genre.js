  exports.seed = function (knex) {
      // Deletes ALL existing entries
      return knex('Genre').del()
          .then(function () {
              // Inserts seed entries
              return knex('Genre').insert([{
                      "id": 1,
                      "genre_name": "pop",
                  },
                  {
                      "id": 2,
                      "genre_name": "tropical",
                  },
                  {
                      "id": 3,
                      "genre_name": "tropical house",
                  },
                  {
                      "id": 4,
                      "genre_name": "trap",
                  },
              ]);
          });
  };
