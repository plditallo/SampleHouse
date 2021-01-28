exports.up = function (knex) {
    return knex.schema.createTable("Subscription", (tbl) => {
        tbl.increments("id").primary().unique()
        tbl.uuid("user_id").references("User.id").notNullable();
        tbl.string("plan_id").references("Plan.id")
        tbl.date("subscribe_start")
        tbl.date("subscribe_end")
        tbl.date("trial_start")
        tbl.date("trial_end")
        tbl.boolean("transaction_verified").default(false);
    })
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists("Subscription")
};
// 20201216120417
// PLAN=20201228155405
