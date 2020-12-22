module.exports = (req, res, next) => {
  const {
    authorization
  } = req.headers;
  console.log("restricted", {
    authorization
  });
  if (authorization) {
    jwt.verify(authorization, JWT_SECRET, (err, decodedToken) => {
      if (err) {
        res.status(401).json({
          errormsg: "Invalid Credentials"
        });
      } else {
        req.decodedToken = decodedToken;
        next();
      }
    });
  } else {
    res.status(400).json({
      msg: "No credentials provided"
    });
  }
};
