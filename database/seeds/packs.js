exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex('pack').del()
        .then(function () {
            // Inserts seed entries
            return knex('pack').insert([{
                    title: "SH Essential Drums",
                    artist: "SampleHouse",
                    description: "description here"
                },
                {
                    title: "SH Exotic Flutes",
                    artist: "SampleHouse",
                    description: "description here"
                },
                {
                    title: "SH Radio Piano",
                    artist: "SampleHouse",
                    description: "description here"
                },
                {
                    title: "SH Tropical Storm",
                    artist: "SampleHouse",
                    description: "description here"
                },
            ]);
        });
};
