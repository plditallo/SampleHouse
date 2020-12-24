const router = require("express").Router();


//* ROUTES
const userRouter = require("./routes/userRouter");
const subscriptionRouter = require("./routes/subscriptionRouter");
const tokenRouter = require("./routes/tokenRouter");

//* MIDDLEWARE
// const restricted = require("./middleware/restricted");


router.use("/user", userRouter);
router.use("/subscribe", subscriptionRouter);
router.use("/token", tokenRouter)



router.use("/", (req, res) => {
  res.status(200).json({
    api: "api-router: up"
  })
});

module.exports = router;
