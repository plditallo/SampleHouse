const router = require("express").Router();
const planDb = require("../../../database/model/planModel");

router.get("/", (req, res) => {
    planDb.getPlans().then((resp) => res.status(200).json(resp)).catch(err => res.status(500).json(err))
})

module.exports = router;
