const {
  verify
} = require("jsonwebtoken")

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
    req.decodedToken = decodedToken;
    next();
  });
};
