const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/authmiddleware");
const adminControl = require("../controller/adminControl");
const upload = require("../middleware/multer");

router.post("/login", adminControl.login);
router.get("/users", authenticate, adminControl.users);
router.get("/users/:id", authenticate, adminControl.user);
router.get("/product", authenticate, adminControl.products);
router.route("/products")
  .get(authenticate, adminControl.productsByCategory)
  .post(authenticate, upload.single("image"), adminControl.addProduct);
router.route("/products/:id")
  .get(authenticate, adminControl.productsById)
  .put(authenticate, upload.single("image"), adminControl.updateProduct)
  .delete(authenticate, adminControl.deleteProduct);
router.get("/stats", authenticate, adminControl.stats);
router.get("/orders", authenticate, adminControl.orders);

module.exports = router;
