const express = require("express");
const router = express.Router();
const { checkOutPayment } = require("../controllers/checkout.controller");
const {
    getAllTransaction,
    getTransactionDetails,
    changeTransactionStatus,
} = require("../controllers/transaction.controller");

router.post("/checkout", checkOutPayment);
router.get("/transaction", getAllTransaction);
router.get("/transaction-detail", getTransactionDetails);
router.post("/transaction-status", changeTransactionStatus);

module.exports = router;
