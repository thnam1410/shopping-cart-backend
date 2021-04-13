const {getUserTransactionDetails, getAllUser, updateUserRole, resetPassword, deleteUser, forgotPassword} = require("../controllers/user.controller");
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
router.delete('/delete', authAdmin, deleteUser)

router.post('/reset-password', forgotPassword)
router.post('/reset-password-confirm', resetPassword)
module.exports = router;
