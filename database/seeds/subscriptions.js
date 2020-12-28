exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('Plan').del()
    .then(function () {
      // Inserts seed entries
      return knex('Plan').insert([{
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
