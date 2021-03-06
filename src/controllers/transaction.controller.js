const Product = require("../models/product");
const Transaction = require("../models/transaction");
const Customer = require("../models/customer");

// /api/checkout
exports.checkOutPayment = async (req, res) => {
    const { cart, paymentInformations } = req.body;
    // console.log(cart);

    //Reduce quantity Items in Db
    try {
        for (const item of cart) {
            let { name, size, quantity } = item;
            // Do something in db
            // Async/Await
            let product = await Product.findOne({ name: name });
            const queryIndex = product.sizes.findIndex((x) => x.size == size);
            product.sizes[queryIndex].quantity -= quantity;

            await product.save();
            console.log(product);
            //Promise
            // Product.findOne({ name: name }, (err, product) => {
            //     const queryIndex = product.sizes.findIndex(
            //         (x) => x.size == size
            //     );
            //     product.sizes[queryIndex].quantity -= quantity;
            //     product.save((err, doc) => {
            //         if (err) throw "Can Not Save";
            //         console.log(doc.sizes);
            //     });
            // });
        }
        return res.status(200).json({ message: "ok" });
    } catch (err) {
        res.status(500).json({ error: err });
    }
};
