const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const bodyParser = require("body-parser");
const EmailConfig = require("./helpers/email");
const connectDB = require("./database/connection");

const app = express();

EmailConfig.init();
app.use(express.json());
app.use(cors());
app.use("/documents", express.static("documents"));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/", routes);

connectDB();

module.exports = app;
