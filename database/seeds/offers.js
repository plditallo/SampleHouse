exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('Offer').del()
    .then(function () {
      // Inserts seed entries
      return knex('Offer').insert([{
          id: 1,
          name: "offer 1",
          stripe_prod_id: "prod_IfTHoWtckjCJrl",
          stripe_price_id: "price_1I48KWBPBM0JAFXGRm10zfIO",
          credits: 10,
          price: "5.12"
        },
        {
          id: 2,
          name: "offer 2",
          stripe_prod_id: "prod_IfTHqWQHhzwq3a",
          stripe_price_id: "price_1I48KzBPBM0JAFXGmqLlBtAR",
          credits: 50,
          price: "12.30"
        },
        {
          id: 3,
          name: "offer 3",
          stripe_prod_id: "prod_IfTIrCeqK4kUjm",
          stripe_price_id: "price_1I48LcBPBM0JAFXGPqXGHDIY",
          credits: 100,
          price: "20.00"
        }
      ]);
    });
};
