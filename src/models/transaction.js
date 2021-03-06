const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Product = require("./product");
const Customer = require("./customer");

const schemaOptions = {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
};

const Transaction = new Schema(
    {
        customer: Customer.schema,
        products: [Product.schema],
        totalPrice: Number,
        paymentMethod: String,
        status: {
            type: String,
            enum: ["Submitted", "Cancelled", "Pending", "Shippng", "Done"],
        },
    },
    schemaOptions
);

module.exports = mongoose.model("Transaction", Transaction, "transactions");
