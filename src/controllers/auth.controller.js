const User = require("../models/user");

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
        res.send({ username: user.username, token });
    } catch (error) {
        res.status(400).send(error);
    }
};
// [GET] /auth/user/me
exports.getProfile = async (req, res) => {
    res.send(req.user);
};

// // [POST] /auth/user/logout
// exports.logout = async (req, res) => {
//     res.send(req.user);
// };
