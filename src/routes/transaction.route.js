const express = require("express");
const router = express.Router();
const { checkOutPayment } = require("../controllers/checkout.controller");
const {
    getAllTransaction,
    getTransactionDetails,
    changeTransactionStatus,
} = require("../controllers/transaction.controller");
const { authAdmin, authAdminAndManager } = require("../middlewares/auth");
router.post("/checkout", checkOutPayment);
router.get("/transaction", authAdminAndManager, getAllTransaction);
router.get("/transaction-detail", authAdminAndManager, getTransactionDetails);
router.post(
    "/transaction-status",
    authAdminAndManager,
    changeTransactionStatus
);

module.exports = router;
