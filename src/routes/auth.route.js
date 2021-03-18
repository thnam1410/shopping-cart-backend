const express = require("express");
const router = express.Router();
const {
    register,
    login,
    getProfile,
    // logout,
} = require("../controllers/auth.controller");
// Auth middlewares
const {
    auth,
    checkUsernameOrEmailExisted,
    checkExpiredToken,
} = require("../middlewares/auth");

router.post("/login", login);
router.post("/register", checkUsernameOrEmailExisted, register);
router.get("/user/me", auth, checkExpiredToken, getProfile);
// router.get("/user/logout", authMiddleware, logout);

module.exports = router;
