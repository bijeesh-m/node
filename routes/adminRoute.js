const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/authmiddleware");
const adminControl = require("../controller/adminControl");
const upload = require("../middleware/multer");

router.post("/login", adminControl.login);
router.get("/users", authenticate, adminControl.users);
router.get("/users/:id", authenticate, adminControl.user);
router.get("/product", authenticate, adminControl.products);
router.get("/products", authenticate, adminControl.productsByCategory);
router.get("/products/:id", authenticate, adminControl.productsById);
router.post(
  "/products",
  authenticate,
  upload.single("image"),
  adminControl.addProduct
);
router.put(
  "/products/:id",
  authenticate,
  upload.single("image"),
  adminControl.updateProduct
);
router.delete("/products/:id", authenticate, adminControl.deleteProduct);
router.get("/stats", authenticate, adminControl.stats);
router.get("/orders", authenticate, adminControl.orders);

module.exports = router;
