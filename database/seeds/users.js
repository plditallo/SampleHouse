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
        email: 'jack@testing.com',
        password: hashSync('password', 13),
        isVerified: true,
        first_name: "Jack",
        last_name: "Barry",
        role: "testing"
      }, {
        id: "de4fc280-59d4-11eb-aff7-07250d070e64",
        email: "craigfechtermusic@gmail.com",
        password: hashSync('password', 13),
        isVerified: true,
        first_name: "Craig",
        last_name: "Fechter",
        role: "admin",
        balance: 1000000,
        vst_access: true,
      }, {
        id: "d6866bc0-5c1e-11eb-8322-950544e3bd28",
        email: "beta@sample.house",
        password: hashSync('tiger6381', 13),
        isVerified: true,
        first_name: "Beta",
        last_name: "Tester",
        role: "beta",
        balance: 100,
        vst_access: true,
      }]);
    });
};
