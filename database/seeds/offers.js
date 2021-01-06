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
          credits: 100,
          price: "4.49" //.0449
        },
        {
          id: 2,
          name: "offer 2",
          stripe_prod_id: "prod_IfTHqWQHhzwq3a",
          stripe_price_id: "price_1I48KzBPBM0JAFXGmqLlBtAR",
          credits: 250,
          price: "9.49" //0.03796
        },
        {
          id: 3,
          name: "offer 3",
          stripe_prod_id: "prod_IfTIrCeqK4kUjm",
          stripe_price_id: "price_1I48LcBPBM0JAFXGPqXGHDIY",
          credits: 500,
          price: "18.49" //0.03698
        }
      ]);
    });
};
