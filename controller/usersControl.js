const { authSchema } = require("../helpers/validationSchema");
const Users = require("../models/users");
const products = require("../models/products");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const maxAge = 12 * 60 * 60 * 1000;
const createToken = (id) => {
  return jwt.sign({ id }, "bijeesh - m secret", {
    expiresIn: maxAge,
  });
};

module.exports.register = async (req, res) => {
  try {
    const result = await authSchema.validateAsync(req.body);
    const userExist = await Users.findOne({ email: result.email });
    if (userExist) {
      res.send("user already registered");
    } else {
      const user = await Users.create(result);
      const token = createToken(user.id);
      res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
      res.json({ user: user._id });
    }
  } catch (err) {
    res.send(err);
  }
};

module.exports.login = async (req, res) => {
  const user = req.body;
  console.log(user);
  const userExist = await Users.findOne({ username: user.username });
  console.log(userExist);
  if (userExist) {
    const auth = await bcrypt.compare(user.password, userExist.password);
    // console.log(bcrypt(user.password))
    console.log(auth);
    if (auth) {
      const token = createToken(userExist._id);
      res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge });
      res.status(200).json({ user: userExist._id });
    } else res.status(400).send("incorrect Password");
  } else res.status(400).send("incorrect username");
};

module.exports.products = async (req, res, next) => {
  try {
  as()
    const product = await products.find();
    res.json(product);
  } catch (err) {
  //  return next(err)
  res.json(err.message)
  }
};

module.exports.product = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const currentProduct = await products.findById(id);
    console.log(currentProduct);
    if (currentProduct) {
      res.json(currentProduct);
    }else{
      res.status(404).send('product not found')
    }
  } catch (err) {
    res.send(`product not found`);
  }
};

module.exports.productsByCategory = async (req, res) => {
  const categoryName = req.params.categoryname;
  const product = await products.find({ category: categoryName });
  if (product.length === 0) res.send("product not found");
  else res.json(product);
};

module.exports.cartItems = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  const user = await Users.findById(id);
  res.json(user.cart);
};

module.exports.updateCart = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await Users.findById(id);
    const cartItems = req.body;
    const isExist = user.cart.find(
      (item) => item.itemName === cartItems.itemName
    );
    if (isExist) {
      res.send("item already in a cart");
    } else {
      user.cart.push(cartItems);
      await user.save();
      res.json(user.cart);
    }
  } catch (err) {
    res.send(`Error occured : ${err}`);
  }
};

module.exports.updateWishlist = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await Users.findById(id);
    const wishlist = req.body;
    const isExist = user.wishlist.find(
      (item) => item.itemName === wishlist.itemName
    );
    if (isExist) {
      res.send("item already in a wishlist");
    } else {
      user.wishlist.push(wishlist);
      await user.save();
      res.json(user.wishlist);
    }
  } catch (err) {
    res.send(`Error occured : ${err}`);
  }
};
module.exports.wishlists = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await Users.findById(id);
    const wishlist = req.body;
    const isExist = user.wishlist.find(
      (item) => item.itemName === wishlist.itemName
    );
    if (isExist) {
      res.json(user.wishlist);
    } else {
      res.send("you have no wishlist");
    }
  } catch (err) {
    res.send(`Error occured : ${err}`);
  }
};
module.exports.deleteWishlist = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await Users.findById(id);
    const empty = [];
    user.wishlist = empty;
    await user.save();
    res.json(user);
  } catch (err) {
    res.send(`Error occured : ${err}`);
  }
};

module.exports.payment = async (req,res)=>{
  
  try {
    // const {amount,exp,cardnumber,mob} = req.body
    // const paymentDetails = processProcess(amount,exp,cardnumber,mob)
    res.send("paymentDetails")
  } catch (err) {
    res.json(err)
  }
  
}
