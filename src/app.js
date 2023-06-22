// mongodb
require("./config/db");

const express = require("express");
// const bodyParser = express.json;
const bodyParser = require("body-parser");
const cors = require("cors");
const routes = require("./routes");

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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(bodyParser());

// templating
app.set("view engine", "ejs");
app.use(express.static("public"));
// express-session
app.use(
  require("express-session")({
    secret: process.env.secret,
    resave: true,
    saveUninitialized: true,
    cookie: { expires: 568036800 },
  })
);

app.use("/api/v1", routes);

// general routes
app.use("/", require("./WebPortal/routes/index"));

//  super admin routes
app.use("/super-admin", require("./WebPortal/routes/SuperAdminSide/index"));
app.use(
  "/super-adminLogin",
  require("./WebPortal/routes/SuperAdminSide/login")
);
app.use(
  "/adminHospitals",
  require("./WebPortal/routes/SuperAdminSide/Hospitals/hospitals")
);
app.use(
  "/adminPatients",
  require("./WebPortal/routes/SuperAdminSide/Patients/Patients")
);

// hospital routes
app.use("/hospital", require("./WebPortal/routes/HospitalSide/profile"));
app.use(
  "/hospitalRegister",
  require("./WebPortal/routes/HospitalSide/Register")
);
app.use("/hospitalLogin", require("./WebPortal/routes/HospitalSide/login"));
app.use(
  "/completeProfile",
  require("./WebPortal/routes/HospitalSide/completeProfile")
);
app.use(
  "/viewHospital",
  require("./WebPortal/routes/SuperAdminSide/Hospitals/viewHospital")
);

module.exports = app;
