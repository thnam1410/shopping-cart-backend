const Transaction = require("../models/transaction");
const User = require("../models/user")
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer")
const bcrypt = require("bcryptjs");

// [GET] /user/transaction
exports.getUserTransactionDetails = async (req, res) => {
    try{
        const userEmail = req.user.email

        const userTransactions = await Transaction.find({
            "customer.email": userEmail
        })

        return res.status(200).send({ data: userTransactions})
    }catch(error){
        console.log(error);
        return res.status(500).json({ message: "Server Error" });
    }
}

// [Get] /user/index
exports.getAllUser = async (req, res) => {
    try {
        const { page, limit } = req.query;
        const options = {
            page: parseInt(page, 10) || 1,
            limit: parseInt(limit, 10) || 20,
        };
        const users = await User.paginate({ role : {$ne: 'Admin'}}, options);
        return res.status(200).json(users);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server Error" });
    }
}

// [POST] /user/update-role
exports.updateUserRole = async (req, res) => {
    try {
        const { _id, role } = req.body;
        const user = await User.findByIdAndUpdate(_id, { role }, { new: true })
        return res.status(200).json(user);
    }catch (err) {
        return res.status(500).json({ message: "Server Error"})
    }
}

//[DELETE] /user/delete
exports.deleteUser = async (req, res) => {
    try {
        const { _id } = req.body;
        console.log(_id)
        await User.findByIdAndRemove(_id);
        return res.status(200).json({message: "Delete Successfully"});
    }catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Server Error"})
    }
}
//[POST] /user/reset-password
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body

        const user = await User.findOne({email: email})
        if(!user){
            return res.status(400).json({ message: "User with input email not found" })
        }
        const token = jwt.sign(
            {
                email,
                exp: Math.floor(Date.now() / 1000) + 5 * 60,
            },
            process.env.RESET_PASSWORD_TOKEN
        );
        const updatedUser = await User.findOneAndUpdate(
            { email: email },
            {
                resetToken: token,
            },
            {
                new: true,
            }
        );
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
        const directionLink = `${process.env.CLIENT_URL}/reset_password/confirm?token=${token}`
        const mailContent = `
        <div>
            <h3>Please <a href="${directionLink}">click here</a> to confirm and reset your password</h3>
        </div>
        `
        let info = await transporter.sendMail({
            from: 'Shopping Cart', // sender address
            to: email, // list of receivers
            subject: "Reset Password", // Subject line
            html: mailContent, // html body
        });
        return res.status(200).json({message: "Send email successfully"});
    }catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Server Error"})
    }
}

//[POST] /user/reset-password
exports.resetPassword = async (req, res) => {
    try{
        const { userEmail, newPassword, token } = req.body
        if(!token){
            return res.status(400).json({message: "Request invalid"})
        }
        const { email, exp} = jwt.decode(token)
        if(exp){
            if(Date.now() - exp < 0) return res.status(401).json({message: "Token expired"})
        }
        const user = await User.findOne({email: email})
        if(userEmail !== user.email){
            return res.status(400).json({message: "Email invalid"})
        }
        if(token !== user.resetToken){
            return res.status(400).json({message: "Token invalid"})
        }
        user.password = await bcrypt.hash(newPassword, 8);
        user.resetToken = ""
        await user.save()

        return res.status(200).json({message: "Ok"})

    }catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Server Error"})
    }
}