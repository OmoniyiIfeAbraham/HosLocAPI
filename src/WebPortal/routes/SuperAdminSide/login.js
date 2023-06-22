const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("SuperAdminSide/login", {
    emailMsg: "",
    passwordMsg: "",
    msg: "",
  });
});

router.post("/", async (req, res) => {
  const sess = req.session;
  const superAdminEmail = process.env.superAdminEmail;
  const adminPassword = process.env.superPassword;
  const email = req.body.email;
  const password = req.body.password;
  if (password.length < 6) {
    res.render("SuperAdminSide/login", {
      emailMsg: "",
      passwordMsg: "Password must be 6 characters or More",
      msg: "",
    });
  } else if (email != superAdminEmail && password != adminPassword) {
    res.render("SuperAdminSide/login", {
      emailMsg: "",
      passwordMsg: "",
      msg: "Email and Password are Incorrect",
    });
  } else if (email != superAdminEmail) {
    res.render("SuperAdminSide/login", {
      emailMsg: "Email is Incorrect",
      passwordMsg: "",
      msg: "",
    });
  } else if (password != adminPassword) {
    res.render("SuperAdminSide/login", {
      emailMsg: "",
      passwordMsg: "Password is Incorrect",
      msg: "",
    });
  } else {
    // const doctors = await doctorMod.find();
    // const patients = await patientMod.find();
    // const schedules = await scheduleMod.find();
    sess.email = email;
    sess.password = password;
    sess.identifier = process.env.identifier;
    // console.log(sess)
    // res.render("admin/home", { doctors, patients, schedules });
    res.render("SuperAdminSide/index");
  }
});

module.exports = router;
