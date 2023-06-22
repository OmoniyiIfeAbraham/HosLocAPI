const express = require("express");
const router = express.Router();

const patientMod = require("./../../../Patient/domains/user/model");
const hospitalMod = require("./../../models/HospitalSide/Profile/profile");

router.get("/", async (req, res) => {
  const sess = req.session;
  if (sess.email && sess.password && sess.identifier === "admin") {
    const patients = await patientMod.find();
    const hospitals = await hospitalMod.find();
    res.render("SuperAdminSide/index", { patients, hospitals });
  } else {
    res.redirect("/super-adminLogin");
  }
});

module.exports = router;
