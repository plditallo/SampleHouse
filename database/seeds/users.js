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
        role: "admin",
        balance: 20,
        created: Date.now()
      }, {
        id: "f0889260-4acf-11eb-91bb-4b4493019fcc",
        email: 'test@test.com',
        password: hashSync('password', 13),
        isVerified: true,
        first_name: "Test",
        last_name: "user",
        role: "testing",
        balance: 20,
        created: Date.now()
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
        created: Date.now()
      }]);
    });
};
