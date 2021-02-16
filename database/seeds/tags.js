  exports.seed = function (knex) {
      // Deletes ALL existing entries
      return knex('Tag').del()
          .then(function () {
              // Inserts seed entries
              return knex('Tag').insert([{
                      "id": 1,
                      "tag_name": "closed hat",
                  },
                  {
                      "id": 2,
                      "tag_name": "hats",
                  },
                  {
                      "id": 3,
                      "tag_name": "hh",
                  },
                  {
                      "id": 4,
                      "tag_name": "pluck",
                  },
                  {
                      "id": 5,
                      "tag_name": "trop",
                  },
                  {
                      "id": 6,
                      "tag_name": "vocal chop",
                  },
                  {
                      "id": 7,
                      "tag_name": "lofi",
                  },
                  {
                      "id": 8,
                      "tag_name": "woodwind",
                  },
                  {
                      "id": 9,
                      "tag_name": "tropical",
                  },
              ]);
          });
  };
