require("dotenv").config();
const Transaction = require("../models/transaction");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
// [GET] /api/transaction
exports.getAllTransaction = async (req, res) => {
    try {
        const { page, limit, status, phone, method } = req.query;
        const options = {
            page: parseInt(page, 10) || 1,
            limit: parseInt(limit, 10) || 10,
            sort: { createdAt: -1 },
        };

        let filter = {
            status,
            paymentMethod: method,
            "customer.phoneNumber": phone && { $regex: new RegExp(phone,'i')}
        }
        Object.keys(filter).forEach(key => filter[key] === undefined && delete filter[key])

        console.log(filter)
        const transactions = await Transaction.paginate(filter, options);
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
        return res.status(500).json({ message: "Server Error" });
    }
};

//[POST] /api/transaction/create-payment-intent
exports.createPaymentIntent = async (req, res) => {
    try {
        const {cart} = req.body;
        const totalPrice = cart.reduce((total, item) => (total += item.price * item.quantity), 0)
        const paymentIntent = await stripe.paymentIntents.create({
            amount: totalPrice,
            currency: "vnd"
        });
        res.send({
            clientSecret: paymentIntent.client_secret
        });
    } catch (e) {
        console.log(e)
        res.status(400).json({message: "Items not found"})
    }
}
/*
Payment succeeds
4242 4242 4242 4242

Authentication required
4000 0025 0000 3155

Payment is declined
4000 0000 0000 9995
*/
