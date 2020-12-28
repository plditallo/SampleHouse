exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('User').del()
    .then(function () {
      // Inserts seed entries
      return knex('User').insert([{
          email: 'user1@email.com',
          password: 'password'
        },
        {
          email: 'user2@email.com',
          password: 'password'
        },
        {
          email: 'user3@email.com',
          password: 'password'
        },
      ]);
    });
};
