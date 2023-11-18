const jwt = require("jsonwebtoken");

const maxAge = 12 * 60 * 60 * 1000;

module.exports.createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: maxAge,
  });
};
