exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('Plan').del()
    .then(function () {
      // Inserts seed entries
      return knex('Plan').insert([{
          id: 1,
          credits: 1,
          cost: 5.00
        },
        {
          id: 2,
          credits: 10,
          cost: 15.26
        },
        {
          id: 3,
          credits: 50,
          cost: 29.99
        }
      ]);
    });
};
