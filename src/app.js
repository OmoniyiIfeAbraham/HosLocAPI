// mongodb
require("./config/db");

const express = require("express");
const bodyParser = express.json;
const cors = require("cors");
const routes = require('./routes')

// cloudinary
const cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

// create server app
const app = express();

// express-fileupload
app.use(require("express-fileupload")({ useTempFiles: true }));

app.use(cors());
app.use(bodyParser());
app.use('/api/v1', routes)

module.exports = app;
