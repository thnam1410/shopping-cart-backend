const express = require("express");
const router = express.Router();
const { checkOutPayment } = require("../controllers/checkout.controller");
const {
    getAllTransaction,
    getTransactionDetails,
    changeTransactionStatus,
    getUserTransactionDetails,
    createPaymentIntent,
    sendMail
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
/*
body:
    [
        {
            name: string - 'Yeezy 700 OG',
            price: string - 17500000,
            size: string - '46',
            quantity: number - 1,
            img: string - 'upload/2021-02-22T14-04-34.627Z_.jpg'
        },...
    ]

 */
router.post("/transaction/create-payment-intent",createPaymentIntent)

router.post('/send-mail', sendMail)

module.exports = router;
