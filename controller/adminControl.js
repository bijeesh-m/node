const Users = require("../models/users");
const Product = require("../models/products");
const jwt = require("jsonwebtoken");
const cloudinary = require("../utils/cloudinary");
const customError = require("../utils/customError");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const admin = {
  username: "bijeesh",
  password: "0977",
};

const maxAge = 12 * 60 * 60 * 1000;
const createToken = (username) => {
  return jwt.sign({ username }, "bijeesh - m admin secret", {
    expiresIn: maxAge,
  });
};

module.exports.login = async (req, res, next) => {
  const { username, password } = req.body;
  if (!username && !password) {
    res.send("enter the username and password");
  } else if (admin.username === username && admin.password === password) {
    const token = createToken(username);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge });
    res.status(200).json({
      status: "success",
      message: "Successfully logged In.",
      jwt: token,
    });
  } else {
    res.send("incorrect username or password");
  }
};

module.exports.users = asyncErrorHandler(async (req, res, next) => {
  const users = await Users.find();
  res.status(200).json({
    status: "success",
    message: "Successfully fetched user datas.",
    data: users,
  });
});
module.exports.user = async (req, res, next) => {
  const userId = req.params.id;
  const user = await Users.findOne({ _id: userId });
  res.status(200).json({
    status: "success",
    message: "Successfully fetched user data.",
    data: user,
  });
};
module.exports.products = async (req, res, next) => {
  const products = await Product.find();
  res.status(200).json({
    status: "success",
    message: "Successfully fetched products detail.",
    data: products,
  });
};
module.exports.productsByCategory = async (req, res, next) => {
  const category = req.query.category;
  const products = await Product.find({ category: category });
  res.status(200).json({
    status: "success",
    message: "Successfully fetched products detail.",
    data: products,
  });
};
module.exports.productsById = async (req, res, next) => {
  const prodId = req.params.id;
  const product = await Product.findOne({ _id: prodId });
  if (product) {
    res.status(200).json({
      status: "success",
      message: "Successfully fetched product details.",
      data: product,
    });
  } else res.send("product not found");
};
module.exports.addProduct = async (req, res, next) => {
  try {
    const { title, price, description, category } = req.body;
    const isExist = await Product.findOne({ title: title });
    if (isExist) {
      res.send("product already exist");
    } else {
      const result = await cloudinary.uploader.upload(req.file.path);
      const product = await Product.create({
        title,
        price,
        description,
        category,
        image: result.url,
      });
      res.status(201).json({
        status: "success",
        message: "Successfully created a product.",
        data: product,
      });
    }
  } catch (err) {
    res.json(err);
  }
};
module.exports.deleteProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    console.log(id);
    const isExist = await prodModel.findById(id);
    if (isExist) {
      await prodModel.deleteOne({ _id: id });
      res.json({
        status: "success",
        message: "Successfully deleted a product.",
      });
    } else {
      res.send("product not found");
    }
  } catch (err) {
    res.send("product not found");
  }
};
module.exports.stats = async (req, res, next) => {
  const users = await Users.find();
  const orders = users.flatMap((user) => user.orders);
  const priceDetils = orders.map((item) => item.total_price);
  const totalRevenue = priceDetils.reduce((total, price) => total + price, 0);
  const products = orders.flatMap((order) => order.items);
  const totalProductSold = products.length;
  const stats = {
    Total_Producs_Sold: totalProductSold,
    Total_Revenue: totalRevenue,
  };
  res.json({
    status: "success",
    message: "Successfully fetched stats.",
    data: stats,
  });
};
module.exports.orders = async (req, res, next) => {
  const users = await Users.find();
  const orders = users.map((user) => user.orders);
  const orderDetails = orders.filter((order) => order.length > 0);

  res.json({
    status: "success",
    message: "Successfully fetched order detail.",
    data: orderDetails,
  });
};

module.exports.updateProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { title, description, price, category } = req.body;
    const isExist = await Product.findById(id);
    if (isExist) {
      const upload = await cloudinary.uploader.upload(req.file.path);
      const updatedProduct = await Product.findByIdAndUpdate(id, {
        $set: {
          title: title,
          description: description,
          price: price,
          category: category,
          image: upload.url,
        },
      });
      res.json({
        status: "success",
        message: "Successfully updated a product.",
        data: updatedProduct,
      });
    } else {
      res.json("product not found");
    }
  } catch (err) {
    res.json(err);
  }
};
