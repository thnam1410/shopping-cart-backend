const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoosePaginate = require("mongoose-paginate");
require("dotenv").config();

const userSchema = mongoose.Schema({
    username: String,
    password: String,
    email: String,
    fullName: String,
    address: String,
    phoneNumber: String,
    role: {
        type: String,
        enum: ["Admin", "Manager", "User"],
        default: "User",
    },
    resetToken: {
        type: String,
        default: null,
    }
});

userSchema.pre("save", async function (next) {
    // Hash the password before saving the user model
    const user = this;
    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

userSchema.methods.generateAuthToken = async function () {
    // Generate an auth token for the user
    const user = this;
    const token = jwt.sign(
        {
            _id: user._id,
            exp: Math.floor(Date.now() / 1000) + 60 * 60,
            role: user.role,
        },
        process.env.SECRET_KEY
    );
    await user.save();
    return token;
};

// For login
userSchema.statics.findByCredentials = async (username, password) => {
    // Search for a user by email and password.
    const user = await User.findOne({ username });
    if (!user) {
        throw new Error({ error: "User is not existed" });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
        throw new Error({ error: "Wrong Password, Please try again!" });
    }
    return user;
};

userSchema.plugin(mongoosePaginate)

const User = mongoose.model("User", userSchema, "users");

module.exports = User;
