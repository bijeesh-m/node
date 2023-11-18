const { authSchema } = require("../helpers/validationSchema");
const { createToken } = require("../helpers/createToken");
const Users = require("../models/users");
const products = require("../models/products");
const bcrypt = require("bcrypt");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const { customError } = require("../utils/customError");

///////////////////////// USER REGISTRATION ///////////////////////////

module.exports.register = asyncErrorHandler(async (req, res, next) => {
  const newUser = await authSchema.validateAsync(req.body);
  const userExist = await Users.findOne({ email: newUser.email });
  if (userExist) {
    const err = new customError("user already exist", 409);
    next(err);
  } else {
    const user = await Users.create(newUser);
    res.status(200).json({
      status: "success",
      message: "Registration Success.",
      data: user._id,
    });
  }
});

///////////////////////// USER LOGIN ///////////////////////////

module.exports.login = asyncErrorHandler(async (req, res) => {
  const user = req.body;
  const userExist = await Users.findOne({ username: user.username });
  if (userExist) {
    const auth = await bcrypt.compare(user.password, userExist.password);
    if (auth) {
      const token = createToken(userExist._id);
      res.cookie("userjwt", token, {
        httpOnly: true,
        maxAge: 12 * 60 * 60 * 1000,
      });
      res.status(200).json({
        status: "Success",
        message: "Login success",
        user: userExist._id,
      });
    } else
      res.status(401).json({
        status: "failed",
        message: "incorrect password",
      });
  } else
    res.status(401).json({
      status: "failed",
      message: "incorrect username",
    });
});

///////////////////////// GET ALL PRODUCTS ///////////////////////////

module.exports.products = asyncErrorHandler(async (req, res, next) => {
  const product = await products.find();
  if (!product) {
    const err = new customError("No products availablr", 404);
    return next(err);
  } else {
    res.status(401).json({
      status: "Success",
      message: "prodct successfully fetched",
      data: product,
    });
  }
});

///////////////////////// GET SPECIFIC PRODUCT ///////////////////////////

module.exports.product = asyncErrorHandler(async (req, res, next) => {
  const id = req.params.id;
  const currentProduct = await products.findById(id);
  if (currentProduct) {
    res.status(200).json({
      status: "success",
      message: "Successfully fetched product.",
      data: currentProduct,
    });
  } else {
    const err = new customError("product not found", 404);
    next(err);
  }
});

///////////////////////// PRODUCTS BY CATEGORY ///////////////////////////

module.exports.productsByCategory = asyncErrorHandler(
  async (req, res, next) => {
    const categoryName = req.params.categoryname;
    const product = await products.find({ category: categoryName });
    if (product.length === 0) {
      const err = new customError("item not matching", 404);
      next(err);
    } else {
      res.status(200).json({
        status: "success",
        message: "Successfully fetched producs.",
        data: product,
      });
    }
  }
);

///////////////////////// USER CART ///////////////////////////

module.exports.cartItems = asyncErrorHandler(async (req, res, next) => {
  const id = req.params.id;
  const user = await Users.findById(id);
  if (user.cart.length === 0) {
    const err = new customError("cart is empty", 404);
    next(err);
  } else {
    res.status(200).json({
      status: "success",
      message: "Successfully fetched user cart.",
      data: user.cart,
    });
  }
});

///////////////////////// ADD PRODUCTS TO CART ///////////////////////////

module.exports.addToCart = asyncErrorHandler(async (req, res, next) => {
  const userid = req.params.id;
  const prodId = req.body.prodId;
  const user = await Users.findById(userid);
  const product = await products.findById(prodId);
  const isExist = user.cart.find((item) => item._id == prodId);
  if (isExist) {
    const err = new customError("item already exist", 409);
    next(err);
  } else {
    const updatedUser = await Users.findByIdAndUpdate(
      userid,
      { $push: { cart: product } },
      { new: true }
    );
    await updatedUser.save();
    res.status(200).json({
      status: "success",
      message: "Successfully item added to cart.",
      data: updatedUser.cart,
    });
  }
});

///////////////////////// ADD PRODUCT TO WISHLIST ///////////////////////////

module.exports.updateWishlist = asyncErrorHandler(async (req, res, next) => {
  const userid = req.params.id;
  const prodId = req.body.prodId;
  const user = await Users.findById(userid);
  const product = await products.findById(prodId);
  const isExist = user.wishlist.find((item) => item._id == prodId);
  if (isExist) {
    const err = new customError("item already exist", 409);
    next(err);
  } else {
    const updatedUser = await Users.findByIdAndUpdate(
      userid,
      { $push: { wishlist: product } },
      { new: true }
    );
    await updatedUser.save();
    res.status(200).json({
      status: "success",
      message: "Successfully updated wishlist.",
      data: updatedUser.wishlist,
    });
  }
});

///////////////////////// USER WISHLIST ///////////////////////////

module.exports.wishlists = asyncErrorHandler(async (req, res, next) => {
  const id = req.params.id;
  const user = await Users.findById(id);
  if (user.wishlist.length === 0) {
    const err = new customError("wishlist is empty", 404);
    next(err);
  } else {
    res.status(200).json({
      status: "success",
      message: "Successfully fetched wishlist detailS.",
      data: user.wishlist,
    });
  }
});

///////////////////////// DELETE PRODUCTS  FROM WISHLIST ///////////////////////////

module.exports.deleteWishlist = asyncErrorHandler(async (req, res, next) => {
  const userid = req.params.id;
  const prodId = req.body.prodId;
  const user = await Users.findById(userid);
  const updatedWishlist = user.wishlist.filter((item) => item._id != prodId);
  const isExist = user.wishlist.find((item) => item._id == prodId);
  if (isExist) {
    const updatedUser = await Users.findByIdAndUpdate(
      userid,
      { $set: { wishlist: updatedWishlist } },
      { new: true }
    );
    await updatedUser.save();
    res.status(200).json({
      status: "success",
      message: "Successfully deleted whishlist item.",
      data: updatedUser.wishlist,
    });
  } else {
    const err = new customError("the item not found", 404);
    next(err);
  }
});

///////////////////////// PAYMENT ///////////////////////////

module.exports.payment = asyncErrorHandler(async (req, res) => {
  // const {amount,exp,cardnumber,mob} = req.body
  // const paymentDetails = processProcess(amount,exp,cardnumber,mob)
  res.send("paymentDetails");
});
