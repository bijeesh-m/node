const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UsersSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cart: Array,
  wishlist: Array,
  orders: Array,
});

UsersSchema.pre(
  "save",
  async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password,salt)
    next()
  }
);

const userModel = mongoose.model("users", UsersSchema);
module.exports = userModel;
