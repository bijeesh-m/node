const express = require("express");
// const multer = require('../middleware/multer')
const cloudinary = require("../utils/cloudinary");
const upload = require("../middleware/multer");
// const multer = require("multer");
const router = express.Router();

router.post("/file", upload.single("image"), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    res.json(result);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
