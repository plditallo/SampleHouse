exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('User').del()
    .then(function () {
      // Inserts seed entries
      return knex('User').insert([{
          id: 1,
          email: 'user1',
          password: 'pass1',
          tier: 1
        },
        {
          id: 2,
          email: 'user2',
          password: 'pass2',
          tier: 2
        },
        {
          id: 3,
          email: 'user3',
          password: 'pass3',
          tier: 3
        },
      ]);
    });
};
