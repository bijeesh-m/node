const express = require("express");
const router = express.Router();
const usersControl = require("../controller/usersControl");
const { authenticate } = require("../middleware/authmiddleware");

router.post("/login", usersControl.login);
router.post("/register", usersControl.register);
router.get("/products", authenticate, usersControl.products);
router.get("/products/:id", authenticate, usersControl.product);
router.get(
  "/products/category/:categoryname",
  authenticate,
  usersControl.productsByCategory
);
router.route("/:id/cart")
  .get(authenticate, usersControl.cartItems)
  .post(authenticate, usersControl.addToCart);
router.route("/:id/wishlist")
  .post(authenticate, usersControl.updateWishlist)
  .get(authenticate, usersControl.wishlists)
  .delete(authenticate, usersControl.deleteWishlist);
router.post("/payment", authenticate, usersControl.payment);

module.exports = router;
