module.exports = (req, res, next) => {
  const {
    authorization
  } = req.headers;

  console.log("restricted", {
    authorization
  });

  if (!authorization) res.status(400).json({
    msg: "No credentials provided"
  })

  jwt.verify(authorization, JWT_SECRET, (err, decodedToken) => {
    if (err) {
      res.status(401).json({
        msg: "Invalid Credentials"
      });
    } else {
      req.decodedToken = decodedToken;
      next();
    }
  });

};
