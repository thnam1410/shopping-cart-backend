const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const route = require("./routes");
const db = require("./config/db");

//Connect Database
db.connect();

const app = express();
const port = 5000;

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

route(app);

app.listen(port, () => console.log(`App is listening at port:${port}`));
