exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('Subscription').del()
    .then(function () {
      // Inserts seed entries
      return knex('Subscription').insert([{
          id: 1,
          credits: 1
        },
        {
          id: 2,
          credits: 10
        },
        {
          id: 3,
          credits: 50
        }
      ]);
    });
};
