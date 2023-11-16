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
router.get("/:id/cart", authenticate, usersControl.cartItems);
router.post("/:id/cart", authenticate, usersControl.updateCart);
router.post("/:id/wishlist", authenticate, usersControl.updateWishlist);
router.get("/:id/wishlist", authenticate, usersControl.wishlists);
router.delete("/:id/wishlist", authenticate, usersControl.deleteWishlist);
router.post("/payment",authenticate,usersControl.payment)

module.exports = router;
