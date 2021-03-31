const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.auth = async (req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        const data = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findOne({
            _id: data._id,
        });
        if (!user) {
            throw new Error();
        }
        req.user = user;
        req.token = token;
        req.exp = data.exp;
        next();
    } catch (error) {
        res.status(401).json({
            error: "Not authorized to access this resource",
        });
    }
};

exports.authAdmin = async (req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        const data = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findOne({
            _id: data._id,
        });
        if (!user) {
            throw new Error();
        }
        if (user.role !== "Admin") {
            throw new Error();
        }
        next();
    } catch (error) {
        console.log(error);
        res.status(404).json({
            error: "Can not access",
        });
    }
};
exports.authUser = async(req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        const data = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findOne({
            _id: data._id,
        });
        if (!user) {
            throw new Error("Can not find User");
        }

        req.user = user
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            error: "Can not access",
        });
    }
}
exports.authAdminAndManager = async (req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        const data = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findOne({
            _id: data._id,
        });
        if (!user) {
            throw new Error();
        }
        if (user.role === "User") {
            throw new Error();
        }
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            error: "Can not access",
        });
    }
};
exports.checkExpiredToken = async (req, res, next) => {
    try {
        const exp = req.exp;
        console.log(Date.now());
        console.log(exp);
        if (Date.now() - exp <= 0) {
            throw new Error();
        }
        next();
    } catch (error) {
        res.status(401).json({
            error: "Not authorized to access this resource",
        });
    }
};
exports.checkUsernameOrEmailExisted = async (req, res, next) => {
    try {
        const username = req.body.username;
        const email = req.body.email;
        const userByUserName = await User.findOne({ username: username });
        const userByEmail = await User.findOne({ email: email });
        if (userByUserName) {
            throw new Error("Username is existed");
        }
        if (userByEmail) {
            throw new Error("Email is existed");
        }
        next();
    } catch (error) {
        console.log(error.toString());
        res.status(409).json({
            error: true,
            message: error.toString(),
        });
    }
};
