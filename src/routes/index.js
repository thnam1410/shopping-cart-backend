const productRouter = require("./product.route");
const apiTransactionRouter = require("./transaction.route");

const route = (app) => {
    app.use("/product", productRouter);
    app.use("/api", apiTransactionRouter)
};

module.exports = route;
