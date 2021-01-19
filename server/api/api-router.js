const router = require("express").Router();


//* ROUTES
const userRouter = require("./routes/userRouter");
const purchaseRouter = require("./routes/purchaseRouter");
const tokenRouter = require("./routes/tokenRouter");
const soundRouter = require("./routes/soundRouter");

//* MIDDLEWARE
const restricted = require("./middleware/restricted");


router.use("/user", userRouter);
router.use("/token", tokenRouter);
router.use("/purchase", restricted, purchaseRouter);
//todo add restricted route for sounds
router.use("/sounds", soundRouter)

router.use("/", (req, res) => {
  res.status(200).json({
    api: "api-router: up"
  })
});

module.exports = router;
