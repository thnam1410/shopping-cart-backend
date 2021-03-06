const mongoose = require("mongoose");
const Product = require("./product");

const Schema = mongoose.Schema;

const Category = new Schema({
    name: String,
    products: [Product.schema],
});

module.exports = mongoose.model("Category", Category, "category");
