const router = require("express").Router();

//* ROUTES
const userRouter = require("./routes/userRouter");

//* MIDDLEWARE
// const restricted = require("./middleware/restricted");


router.use("/user", userRouter);

router.use("/", (req, res) => {
  res.status(200).json({
    api: "api-router: up"
  })
});

module.exports = router;
