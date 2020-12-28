exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('Offer').del()
    .then(function () {
      // Inserts seed entries
      return knex('Offer').insert([{
          id: 1,
          credits: 10
        },
        {
          id: 2,
          credits: 50
        },
        {
          id: 3,
          credits: 100
        }
      ]);
    });
};
