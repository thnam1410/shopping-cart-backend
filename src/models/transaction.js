const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
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
            enum: ["Submitted", "Cancelled", "Pending", "Shipping", "Done"],
            default: "Submitted",
        },
    },
    schemaOptions
);
Transaction.plugin(mongoosePaginate);
module.exports = mongoose.model("Transaction", Transaction, "transactions");
