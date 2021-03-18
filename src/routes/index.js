const productRouter = require("./product.route");
const apiTransactionRouter = require("./transaction.route");
const authRouter = require("./auth.route");

const route = (app) => {
    app.use("/product", productRouter);
    app.use("/api", apiTransactionRouter);
    app.use("/auth", authRouter);
};

module.exports = route;
