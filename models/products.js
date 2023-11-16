const mongoose = require('mongoose')
const productSchema = new mongoose.Schema({
    title:String,
    description:String,
    price:Number,
    image:String,
    category:String
})

const prodModel = mongoose.model("products", productSchema);
module.exports = prodModel;