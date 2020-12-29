exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('Offer').del()
    .then(function () {
      // Inserts seed entries
      return knex('Offer').insert([{
          id: 1,
          name: "offer 1",
          credits: 10,
          price: 5.12
        },
        {
          id: 2,
          name: "offer 2",
          credits: 50,
          price: 12.30
        },
        {
          id: 3,
          name: "offer 3",
          credits: 100,
          price: 20.00
        }
      ]);
    });
};
