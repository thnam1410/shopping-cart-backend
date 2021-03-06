const express = require("express");
const router = express.Router();
const { checkOutPayment } = require("../controllers/transaction.controller");

router.post("/checkout", checkOutPayment);
module.exports = router;
