const {
  hashSync
} = require("bcryptjs");

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('User').del()
    .then(function () {
      // Inserts seed entries
      return knex('User').insert([{
        id: "f0889260-4acf-11eb-91bb-4b49c1af32be",
        email: 'services@bluesmokemedia.net',
        password: hashSync('password', 13),
        isVerified: true,
        first_name: "Jack",
        last_name: "Barry",
      }]);
    });
};
