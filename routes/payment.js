const express= require("express")
const router = express.Router()
const paymentController = require("../controller/paymentController");
router.post("/create-customer", paymentController.createCustomer);
router.post("/add-card",paymentController.addCard)
router.post("/create-charge",paymentController.createCharge)


module.exports = router