const router = require("express").Router();

//* ROUTES
// const authRouter = require("./routes/authRouter");

//* MIDDLEWARE
// const restricted = require("./middleware/restricted");


// router.use("/auth", authRouter);

router.use("/", (req, res) => {
  res.status(200).json({
    api: "api-router: up"
  })
});

module.exports = router;
