const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const requestedPath = req.originalUrl;
  var token = "";
  var secretKey = "";
  if (requestedPath.startsWith("/admin")) {
    token = req.cookies.adminjwt;
    secretKey = process.env.JWT_SECRET_KEY;
  } else {
    token = req.cookies.userjwt;
    secretKey = process.env.JWT_SECRET_KEY;
  }
  if (token) {
    jwt.verify(token, secretKey, (err, decodedToken) => {
      if (err) {
        res.status(401).send("Authentication failed");
      } else {
        req.decodedToken = decodedToken;
        next();
      }
    });
  } else {
    res.json("Authentication failed");
  }
};

module.exports = { authenticate };
