const express = require("express");
const morgan = require("morgan");
const cors = require("cors")
const route = require("./routes");
const db = require("./config/db");

//Connect Database
db.connect();

const app = express();
const port = 5000;

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/upload',express.static('upload'))
app.use(morgan("common"));

route(app);

app.listen(port, () => console.log(`App is listening at port:${port}`));
