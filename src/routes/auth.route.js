const express = require("express");
const router = express.Router();
const {
    register,
    login,
    getProfile,
    checkToken,
    // logout,
} = require("../controllers/auth.controller");
// Auth middlewares
const {
    auth,
    checkUsernameOrEmailExisted,
    checkExpiredToken,
} = require("../middlewares/auth");

/*
* body:{
*   username: string
*   password: string
* }
* */
router.post("/login", login);

/*'
body:{
    username: string,
    password: string,
    email: string,
    fullName: string,
    address: string,
    phoneNumber: string,
* }
* */
router.post("/register", checkUsernameOrEmailExisted, register);
router.get("/user/me", auth, checkExpiredToken, getProfile);
router.get("/user/check_token", checkToken);

module.exports = router;
