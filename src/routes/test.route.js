require('dotenv').config()
const nodemailer = require('nodemailer')
const express = require("express");
const router = express.Router();

router.post('/test',async (req, res) => {
    try {
        const { fullName, email, address, paymentMethod } = req.body.paymentInformations
        const { cart } = req.body
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
            <p>Customer: <span style="font-size: 16px; font-weight: 700; color: red">${fullName}</span></p>
            <p>Email: <span style="font-size: 16px; font-weight: 700; color: red">${email}</span></p>
            <p>Address: <span style="font-size: 16px; font-weight: 700">${address}</span></p>
            <p>Payment Method: <span style="font-size: 16px; font-weight: 700">${paymentMethod}</span></p>
            <br>
            <h3>Cart Details:</h3>
            <p><b style="font-size: 16px">Total</b>: <span style="font-size: 16px; font-weight: 700; color: red">${cart.reduce((total,item) => total+=(item.price * item.quantity),0).toLocaleString("it-IT",{style: "currency",currency: "VND",})}</span></p>
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
})

module.exports = router