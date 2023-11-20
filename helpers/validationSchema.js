const joi = require("joi");

const authSchema = joi.object({
  username: joi.string().lowercase().required(),
  email: joi.string().email().lowercase().required(),
  password: joi.string().min(2).required(),
});

module.exports = { authSchema: authSchema };
