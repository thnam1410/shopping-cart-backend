const mongoose = require("mongoose");

const connect = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/shopping_cart", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
        });
        console.log("Connect to database successfully!");
    } catch (err) {
        console.log("Connect to database fail !");
    }
};

module.exports = { connect };
