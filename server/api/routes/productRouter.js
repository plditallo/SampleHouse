const router = require("express").Router();
const planDb = require("../../../database/model/planModel");
const offerDb = require("../../../database/model/offerModel");

router.get("/plans", (req, res) => {
    planDb.getPlans().then((resp) => res.status(200).json(resp)).catch(err => res.status(500).json(err))
})

router.get("/offers", (req, res) => {
    offerDb.getOffers().then((resp) => res.status(200).json(resp)).catch(err => res.status(500).json(err))
})

module.exports = router;
