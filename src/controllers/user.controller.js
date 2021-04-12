const Transaction = require("../models/transaction");
const User = require("../models/user")
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer")
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
