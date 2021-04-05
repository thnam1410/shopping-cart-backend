const express = require("express");
const router = express.Router();
const { checkOutPayment } = require("../controllers/checkout.controller");
const {
    getAllTransaction,
    getTransactionDetails,
    changeTransactionStatus,
    getUserTransactionDetails
} = require("../controllers/transaction.controller");
const { authAdmin, authAdminAndManager } = require("../middlewares/auth");

router.get("/transaction", authAdminAndManager, getAllTransaction);
router.get("/transaction-detail", authAdminAndManager, getTransactionDetails);

/*
* body:{
*   cart: array[Product]
*   paymentInformation:{
*       address: string "395 Trần Xuân Soạn"
        email: string "thnam1411110@gmail.com"
        fullName: string "Nam Trương"
        paymentMethod: string "COD"
        phoneNumber: string "0903356112"
*   }
* }
* */
router.post("/checkout", checkOutPayment);

/*
body:{
    _id: string - ID của transaction
    status: string
}

 */
router.post("/transaction-status",authAdminAndManager,changeTransactionStatus);

module.exports = router;
