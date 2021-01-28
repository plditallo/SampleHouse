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
          payPal_id: "P-3UA655559E7099157MAJTDFY",
        },
        {
          id: 2,
          tier: 2,
          name: "Standard",
          credits: 250,
          price: "10.99",
          discount: 27, //*26.61%
          included: [
            "VST Access",
            "Instructional Videos",
            "Samples (one shots)",
            "Loops",
            "Exclusive Loops",
            "MIDI Files",
            "Private Discord",
          ],
          payPal_id: "P-1KL895179M828440HMAJTDUA",
        },
        {
          id: 3,
          tier: 3,
          name: "Studio",
          credits: 500,
          price: "19.99",
          discount: 33, //*33.2554257095%
          included: [
            "VST Access",
            "Instructional Videos",
            "Samples (one shots)",
            "Loops",
            "Exclusive Loops",
            "MIDI Files",
            "Private Discord",
          ],
          payPal_id: "P-147778146U0869313MAJTDXA",
        }
      ]);
    });
};
