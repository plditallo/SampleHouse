  exports.seed = function (knex) {
      // Deletes ALL existing entries
      return knex('SoundToTag').del()
          .then(function () {
              // Inserts seed entries
              return knex('SoundToTag').insert([{
                  "sound_id": 1,
                  "tag_id": 1
              }, {
                  "sound_id": 1,
                  "tag_id": 2
              }, {
                  "sound_id": 1,
                  "tag_id": 3
              }, {
                  "sound_id": 3,
                  "tag_id": 1
              }, {
                  "sound_id": 3,
                  "tag_id": 2
              }, {
                  "sound_id": 3,
                  "tag_id": 3
              }, {
                  "sound_id": 7,
                  "tag_id": 2
              }, {
                  "sound_id": 7,
                  "tag_id": 3
              }, {
                  "sound_id": 7,
                  "tag_id": 4
              }, {
                  "sound_id": 7,
                  "tag_id": 5
              }, {
                  "sound_id": 7,
                  "tag_id": 6
              }, {
                  "sound_id": 8,
                  "tag_id": 1
              }, {
                  "sound_id": 8,
                  "tag_id": 2
              }, {
                  "sound_id": 8,
                  "tag_id": 3
              }, {
                  "sound_id": 9,
                  "tag_id": 7
              }, {
                  "sound_id": 9,
                  "tag_id": 8
              }, {
                  "sound_id": 9,
                  "tag_id": 2
              }, {
                  "sound_id": 9,
                  "tag_id": 3
              }, {
                  "sound_id": 10,
                  "tag_id": 7
              }, {
                  "sound_id": 10,
                  "tag_id": 9
              }, {
                  "sound_id": 11,
                  "tag_id": 1
              }, {
                  "sound_id": 11,
                  "tag_id": 2
              }, {
                  "sound_id": 11,
                  "tag_id": 3
              }]);
          });
  };
