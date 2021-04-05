const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const Schema = mongoose.Schema;

const Product = new Schema({
    name: { type: String, unique: true },
    price: Number,
    mainImage: String,
    subImages: Array,
    sold: {
        type: Number,
        default: 0,
    },
    sizes: [],
    tags: Array,
    category: Array,
});
Product.plugin(mongoosePaginate);
module.exports = mongoose.model("Product", Product, "products");
