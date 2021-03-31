const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const route = require("./src/routes");
const db = require("./src/config/db");

//Connect Database
db.connect();

// App Config
const app = express();
const port = 5000;

//Config swagger
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUI  = require('swagger-ui-express');

const swaggerOptions = {
    swaggerDefinition: {
        info:{
            title: "Shopping Cart API",
            description: "Shopping Cart API Documment",
            contact:{
                name: "SOA"
            },
            servers: ['http://localhost:5000/']
        }
    },
    apis: ["./src/routes*.js"]
}
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/swagger',swaggerUI.serve, swaggerUI.setup(swaggerDocs))
app.use('/test',(req,res) => res.status(200).send('ok'))

//Middlewares
app.use(cors());
app.use(morgan("common"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/upload", express.static("upload"));
app.use("*", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Methods",
        "GET, PUT, POST, DELETE, OPTIONS"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Accept, Origin, Content-Type, access_token"
    );
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

//Routes
route(app);

//Listen
app.listen(port, () => console.log(`App is listening at port:${port}`));
