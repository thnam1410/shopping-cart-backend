const productRouter = require("./product.route");

const route = (app) => {
    app.use("/product", productRouter);
};

module.exports = route;
