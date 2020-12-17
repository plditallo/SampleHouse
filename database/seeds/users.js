exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('User').del()
    .then(function () {
      // Inserts seed entries
      return knex('User').insert([{
          email: 'user1',
          password: 'pass1'
        },
        {
          email: 'user2',
          password: 'pass2'
        },
        {
          email: 'user3',
          password: 'pass3'
        },
      ]);
    });
};
