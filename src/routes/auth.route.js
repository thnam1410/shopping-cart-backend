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
* @swagger
* /books:
*   get:
*       summary: abcxyz
*       responses:
*           200:
*               description: wtf
**/
router.post("/login", login);
router.post("/register", checkUsernameOrEmailExisted, register);
router.get("/user/me", auth, checkExpiredToken, getProfile);
router.get("/user/check_token", checkToken);
// router.get("/user/logout", authMiddleware, logout);

module.exports = router;
