const Product = require("../models/product");
const Transaction = require("../models/transaction");
const User = require("../models/user");

// POST /api/checkout
exports.checkOutPayment = async (req, res) => {
    const { cart, paymentInformations, visaConfirm } = req.body;
    try {
        // Get Customer
        const customer = await getCustomer(paymentInformations);
        // Create Transaction
        const allProductsPurchased = await getAllProducts(cart);
        const totalPrice = cart.reduce(
            (total, { price }) => (total += parseInt(price)),
            0
        );
        console.log(visaConfirm)
        const transaction = visaConfirm ?
            new Transaction({
            totalPrice,
            customer: customer,
            products: allProductsPurchased,
            paymentMethod: paymentInformations.paymentMethod,
                status: "Pending"
        }) : new Transaction({
                totalPrice,
                customer: customer,
                products: allProductsPurchased,
                paymentMethod: paymentInformations.paymentMethod,
            })


        ;
        // Save transaction
        const savedTransaction = await transaction.save();
        if (!savedTransaction) throw TypeError("Can not create transaction");

        // Reduce Item's Quantity
        reduceItemsQuantity(cart);
        return res.status(200).json({ message: "Successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
    }
};

// Find Customer || Create Customer
const getCustomer = async ({ email }) => {
    const existedCustomer = await User.findOne({ email: email });
    return existedCustomer;
};

//Reduce quantity Items in Db
const reduceItemsQuantity = async (cart) => {
    for (const item of cart) {
        let { name, size, quantity } = item;
        let product = await Product.findOne({ name: name });
        const queryIndex = product.sizes.findIndex((x) => x.size == size);

        product.sizes[queryIndex].quantity -= quantity;
        product.sold += quantity;
        const updatedValue = await Product.updateOne(
            { name: name },
            {
                sizes: product.sizes,
                sold: product.sold,
            }
        );
        if (!updatedValue) throw TypeError("Can not update value");
    }
};
//Get all products object in Db
const getAllProducts = async (cart) => {
    let allProducts = [];
    for (const item of cart) {
        const product = await Product.findOne({ name: item.name });
        allProducts.push({
            name: product.name,
            size: item.size,
            price: product.price,
            quantity: item.quantity,
        });
    }
    return allProducts;
};
