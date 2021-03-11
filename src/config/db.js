const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const mongoose = require("mongoose");

const connect = async () => {
    try {
        console.log(process.env.DB_HOST);
        await mongoose.connect(process.env.DB_HOST, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
        });
        console.log("Connect to database successfully!");
    } catch (err) {
        console.log("Connect to database fail !" + err);
    }
};

module.exports = { connect };
