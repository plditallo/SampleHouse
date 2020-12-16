exports.up = function (knex) {
    return knex.schema.createTable("User", (tbl) => {
        tbl.string("id").primary().unique(); //todo unique random id 15 char/num long
        tbl.string("fname").notNullable();
        tbl.string("lname");
        tbl.string("email").notNullable().unique()
        tbl.string("password").notNullable();
        tbl.string("balance").notNullable();
        tbl.date("created").notNullable(); //todo change to a date Date.now()
        tbl.date("subDate").notNullable(); //todo change to a date
    })
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists("User")
};
