exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('Plan').del()
    .then(function () {
      // Inserts seed entries
      return knex('Plan').insert([{
          id: 1,
          name: "tier 1",
          stripe_prod_id: "prod_IfTNk2pqpjBIyz",
          stripe_price_id: "price_1I48QkBPBM0JAFXGWczaXWy5",
          tier: 1,
          credits: 1,
          price: "5.00"
        },
        {
          id: 2,
          name: "tier 2",
          stripe_prod_id: "prod_IfTOi1zKnjEKsL",
          stripe_price_id: "price_1I48RIBPBM0JAFXGmk4lEPOD",
          tier: 2,
          credits: 10,
          price: "15.26"
        },
        {
          id: 3,
          name: "tier 3",
          stripe_prod_id: "prod_IfTO4fowW2Xgtx",
          stripe_price_id: "price_1I48RvBPBM0JAFXG5XSFHyq6",
          tier: 3,
          credits: 50,
          price: "29.99"
        }
      ]);
    });
};
