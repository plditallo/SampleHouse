  exports.seed = function (knex) {
      // Deletes ALL existing entries
      return knex('SoundToGenre').del()
          .then(function () {
              // Inserts seed entries
              return knex('SoundToGenre').insert([{
                      "sound_id": 6,
                      "genre_id": 1
                  },
                  {
                      "sound_id": 6,
                      "genre_id": 2
                  }, {
                      "sound_id": 6,
                      "genre_id": 3
                  }, {
                      "sound_id": 7,
                      "genre_id": 1
                  }, {
                      "sound_id": 7,
                      "genre_id": 2
                  }, {
                      "sound_id": 7,
                      "genre_id": 3
                  }, {
                      "sound_id": 8,
                      "genre_id": 1
                  }, {
                      "sound_id": 8,
                      "genre_id": 2
                  }, {
                      "sound_id": 8,
                      "genre_id": 3
                  }, {
                      "sound_id": 10,
                      "genre_id": 1
                  }, {
                      "sound_id": 10,
                      "genre_id": 4
                  },
              ]);
          });
  };
