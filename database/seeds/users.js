const {
  v1: uuidv1
} = require('uuid');
const {
  hashSync
} = require("bcryptjs");

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('User').del()
    .then(function () {
      // Inserts seed entries
      return knex('User').insert([{
        id: uuidv1(),
        email: 'services@bluesmokemedia.net',
        password: hashSync('password', 13),
        isVerified: true
      }]);
    });
};
