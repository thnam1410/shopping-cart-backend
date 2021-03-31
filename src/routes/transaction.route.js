const express = require("express");
const router = express.Router();
const { checkOutPayment } = require("../controllers/checkout.controller");
const {
    getAllTransaction,
    getTransactionDetails,
    changeTransactionStatus,
    getUserTransactionDetails
} = require("../controllers/transaction.controller");
const { authAdmin, authAdminAndManager, authUser } = require("../middlewares/auth");
router.post("/checkout", checkOutPayment);
router.get("/transaction", authAdminAndManager, getAllTransaction);
router.get("/transaction-detail", authAdminAndManager, getTransactionDetails);
router.get("/user/transaction",authUser , getUserTransactionDetails);
router.post(
    "/transaction-status",
    authAdminAndManager,
    changeTransactionStatus
);

module.exports = router;
