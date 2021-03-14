const Transaction = require("../models/transaction");

// [GET] /api/transaction
exports.getAllTransaction = async (req, res) => {
    try {
        const { page, limit } = req.query;
        const options = {
            page: parseInt(page, 10) || 1,
            limit: parseInt(limit, 10) || 10,
            sort: { createdAt: -1 },
        };
        const transactions = await Transaction.paginate({}, options);
        return res.status(200).json(transactions);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server Error" });
    }
};

// [GET] /api/transaction-detail?id=
exports.getTransactionDetails = async (req, res) => {
    try {
        const { productId } = req.query;
        const transaction = await Transaction.findOne({ _id: productId });
        if (!transaction) {
            return res
                .status(500)
                .json({ message: "Can not find Transaction" });
        }
        return res.status(200).json(transaction);
    } catch (err) {
        console.log(err);
        return res.status(400).json({ message: "Server Error" });
    }
};
// [POST] /api/transaction-status
exports.changeTransactionStatus = async (req, res) => {
    try {
        // console.log(req.body);
        const { _id, status } = req.body;
        const transaction = await Transaction.findOneAndUpdate(
            { _id: _id },
            {
                status: status,
            },
            {
                new: true,
            }
        );
        if (!transaction) {
            return res
                .status(500)
                .json({ message: "Can not find Transaction" });
        }
        return res.status(200).json({ message: "Update successfully" });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Server Error" });
    }
};
