const {getUserTransactionDetails, getAllUser} = require("../controllers/user.controller");
const {authUser, authAdmin} = require("../middlewares/auth");
const express = require('express')
const router = express.Router()


router.get("/transaction", authUser, getUserTransactionDetails);
router.get("/index",authAdmin , getAllUser)

module.exports = router;
