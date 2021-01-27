exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('Plan').del()
    .then(function () {
      // Inserts seed entries
      return knex('Plan').insert([{
          id: 1,
          tier: 1,
          name: "Basic",
          credits: 100,
          price: "5.99",
          included: [
            "Samples (one shots)",
            "Loops",
            "MIDI Files",
            "Private Discord",
          ],
          // todo change payPal_id to live ID
          payPal_id: "P-5NY36749SE7475025MAIOEJI",
          // todo change stipe_id to live ID
          stripe_id: "price_1I48QkBPBM0JAFXGWczaXWy5",
        },
        {
          id: 2,
          tier: 2,
          name: "Standard",
          credits: 250,
          price: "10.99",
          discount: 15, //todo find discount
          included: [
            "VST Access",
            "Instructional Videos",
            "Samples (one shots)",
            "Loops",
            "Exclusive Loops",
            "MIDI Files",
            "Private Discord",
          ],
          payPal_id: "P-03Y07993KV0411933MAIOETA",
          stripe_id: "price_1I48RIBPBM0JAFXGmk4lEPOD",
        },
        {
          id: 3,
          tier: 3,
          name: "Studio",
          credits: 500,
          price: "19.99",
          discount: 20, //todo find discount
          included: [
            "VST Access",
            "Instructional Videos",
            "Samples (one shots)",
            "Loops",
            "Exclusive Loops",
            "MIDI Files",
            "Private Discord",
          ],
          payPal_id: "P-1V678195DT9234000MAIOEYA",
          stripe_id: "price_1I48RvBPBM0JAFXG5XSFHyq6",
        }
      ]);
    });
};
