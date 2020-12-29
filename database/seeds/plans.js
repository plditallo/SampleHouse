exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('Plan').del()
    .then(function () {
      // Inserts seed entries
      return knex('Plan').insert([{
          id: 1,
          tier: 1,
          credits: 1,
          price: 5.00
        },
        {
          id: 2,
          tier: 2,
          credits: 10,
          price: 15.26
        },
        {
          id: 3,
          tier: 3,
          credits: 50,
          price: 29.99
        }
      ]);
    });
};
