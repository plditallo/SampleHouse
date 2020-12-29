exports.up = function (knex) {
    return knex.schema.createTable("Subscription", (tbl) => {
        tbl.increments("id").primary().unique()
        tbl.uuid("user_id").references("User.id").notNullable();
        tbl.integer("plan_id").references("Plan.id")
        tbl.date("subscribe_start")
        tbl.date("subscribe_end")
        tbl.date("trial_start")
        tbl.date("trial_end")
    })
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists("Subscription")
};
