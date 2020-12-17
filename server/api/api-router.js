const router = require("express").Router();

//* ROUTES
const userRouter = require("./routes/userRouter");
const subscriptionRouter = require("./routes/subscriptionRouter");

//* MIDDLEWARE
// const restricted = require("./middleware/restricted");


router.use("/user", userRouter);
router.use("/subscribe", subscriptionRouter);

router.use("/", (req, res) => {
  res.status(200).json({
    api: "api-router: up"
  })
});

module.exports = router;
