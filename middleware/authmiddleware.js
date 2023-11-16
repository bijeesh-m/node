const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const requestedPath = req.originalUrl
  var secretKey = ""
  if (requestedPath.startsWith('/admin')) {
    secretKey = "bijeesh - m admin secret"
  }else{
    secretKey = "bijeesh - m secret"
  }
  const token = req.cookies.jwt
  if (token) {
    jwt.verify(token, secretKey, (err, decodedToken) => {
      if (err) {
        res.status(401).send("Authentication failed");
      } else {
        req.decodedToken = decodedToken
        next();
      }
    });
  }else{
    res.send('Authentication failed')
  }
};

module.exports = {authenticate};
