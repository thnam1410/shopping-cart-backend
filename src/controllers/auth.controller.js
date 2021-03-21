const User = require("../models/user");
const jwt = require("jsonwebtoken");
// [POST] /auth/register
exports.register = async (req, res) => {
    // Create a new user
    try {
        const user = new User(req.body);
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({ status: "success" });
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
};
// [POST] /auth/login
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findByCredentials(username, password);
        if (!user) {
            return res.status(401).send({
                error: "Login failed! Check authentication credentials",
            });
        }
        const token = await user.generateAuthToken();
        res.send({ username: user.username, token, role: user.role });
    } catch (error) {
        res.status(400).send(error);
    }
};
// [GET] /auth/user/me
exports.getProfile = async (req, res) => {
    const { username, fullName, email, role, address, phoneNumber } = req.user;
    res.status(200).json({
        username,
        fullName,
        email,
        address,
        phoneNumber,
        role,
    });
};
// [GET] /auth/user/check_token
exports.checkToken = async (req, res) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        const data = jwt.verify(token, process.env.SECRET_KEY);

        const user = await User.findOne({
            _id: data._id,
        });

        const exp = data.exp;
        if (Date.now() - exp <= 0) {
            throw new Error();
        }
        res.status(200).json({ username: user.username });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Token Expired" });
    }
};

// // [POST] /auth/user/logout
// exports.logout = async (req, res) => {
//     res.send(req.user);
// };
