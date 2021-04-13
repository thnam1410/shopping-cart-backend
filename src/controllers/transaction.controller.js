require("dotenv").config();
const Transaction = require("../models/transaction");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const nodemailer = require('nodemailer')

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
	console.log("DEBUG:::")
	console.log(paymentIntent)
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

exports.sendMail = async(req, res) => {
    try {
        const { fullName, email, address, paymentMethod } = req.body.paymentInformations
        const { cart } = req.body
        console.log(req.body)
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            ignoreTLS: false,
            secure: false,
            auth: {
                user: process.env.GMAIL_USERNAME, // generated ethereal user
                pass: process.env.GMAIL_PASSWORD, // generated ethereal password
            },
        });


        const mailContent = `
        <div> 
            <h2>Thanks for your shopping!!</h2>
            <h3>Payment Details</h3>
            <p>Customer: <span style="font-size: 16px; font-weight: 700; color: #ff0000">${fullName}</span></p>
            <p>Email: <span style="font-size: 16px; font-weight: 700; color: red">${email}</span></p>
            <p>Address: <span style="font-size: 16px; font-weight: 700">${address}</span></p>
            <p>Payment Method: <span style="font-size: 16px; font-weight: 700">${paymentMethod}</span></p>
            <br>
            <h3>Cart Details:</h3>
            <p><b style="font-size: 16px">Total</b>: <span style="font-size: 16px; font-weight: 700; color: red">${cart.reduce((total, item) => total += (item.price * item.quantity), 0).toLocaleString("it-IT", {
            style: "currency",
            currency: "VND",
        })}</span></p>
            ${cart.map(item => (
            `<ul>
                <li>Name: ${item.name}</li>
                <li>Price: ${item.price}</li>
                <li>Size: ${item.size}</li>
                <li>Quantity: ${item.quantity}</li>
            </ul>`
        ))}
        </div>
        `
        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: 'Shopping Cart', // sender address
            to: email, // list of receivers
            subject: "Cart Detail Check Out", // Subject line
            html: mailContent, // html body
        });
        res.status(200).json({ message: "Send mail successfully"})

    }catch (e) {
        console.log(e)
        res.status(500).json({ message: "Server error"})
    }
}
