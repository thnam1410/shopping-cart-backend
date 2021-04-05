const {getUserTransactionDetails, getAllUser, updateUserRole} = require("../controllers/user.controller");
const {authUser, authAdmin} = require("../middlewares/auth");
const express = require('express')
const router = express.Router()


router.get("/transaction", authUser, getUserTransactionDetails);
router.get("/index",authAdmin , getAllUser)

/*
body:{
    _id: ID - id của user
    role: string => Manager hoặc User
}
 */
router.post('/update-role', authAdmin, updateUserRole)

module.exports = router;
