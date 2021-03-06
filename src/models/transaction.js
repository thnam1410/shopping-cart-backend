const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Product = require("./product");
const Customer = require("./customer");

const schemaOptions = {
    timestamps: true,
};

const Transaction = new Schema(
    {
        customer: Customer.schema,
        products: Array,
        totalPrice: Number,
        paymentMethod: String,
        status: {
            type: String,
            enum: ["Submitted", "Cancelled", "Pending", "Shippng", "Done"],
            default: "Submitted",
        },
    },
    schemaOptions
);

module.exports = mongoose.model("Transaction", Transaction, "transactions");
