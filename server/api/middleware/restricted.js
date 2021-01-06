const {
  verify
} = require("jsonwebtoken")
const stripe = require("stripe")(process.env.STRIPE_API_SECRET_KEY)
const {
  getUserById
} = require("../../../database/model/userModel")

module.exports = (req, res, next) => {
  const {
    authorization
  } = req.headers;

  if (!authorization) return res.status(400).json({
    msg: "No authorization token provided"
  })

  verify(authorization, process.env.JWT_SECRET, (err, decodedToken) => {
    if (err) return res.status(401).json({
      msg: "Invalid token"
    })
    // req.decodedToken = decodedToken;
    const user_id = decodedToken.subject

    getUserById(user_id).then(async ([user]) => {
      if (!user) return res.status(403).json({
        msg: `The user ID: ${user_id} is not associated with any account.`
      })
      //* Stripe payment taken out of being ran fro now
      if (paymentTypeIsStripe = false && !user.stripe_id) {
        const customer = await stripe.customers.create({
          name: `${user.first_name} ${user.last_name}`,
          email: user.email,
          description: 'My First Test Customer (created for API docs)'
        });
        user.stripe_id = customer.id
      }
      // console.log({
      //   user
      // })
      req.user = user
      next();
    })
  });
};
