const productRouter = require("./product.route");
const apiTransactionRouter = require("./transaction.route");
const authRouter = require("./auth.route");
const userRouter = require("./user.route");

const route = (app) => {
    app.use("/product", productRouter);
    app.use("/api", apiTransactionRouter);
    app.use("/auth", authRouter);
    app.use("/user", userRouter);
};

module.exports = route;
