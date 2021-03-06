const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Customer = new Schema({
    email: {
        type: String,
        unique: true,
    },
    fullName: String,
    address: String,
    phoneNumber: String,
});

module.exports = mongoose.model("Customer", Customer, "customers");
