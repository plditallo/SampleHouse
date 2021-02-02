exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('Offer').del()
    .then(function () {
      // Inserts seed entries
      return knex('Offer').insert([{
          id: 1,
          name: "offer 1",
          credits: 100,
          price: "4.49", //.0449
          // todo change payPal_id to live ID
          payPal_id: "123"
        },
        {
          id: 2,
          name: "offer 2",
          credits: 250,
          price: "9.49", //0.03796
          discount: 15, //*15.4565701559
          payPal_id: "1234"
        },
        {
          id: 3,
          name: "offer 3",
          credits: 500,
          price: "18.49", //0.03698
          discount: 18, //*17.6391982183
          payPal_id: "12345"
        }
      ]);
    });
};
