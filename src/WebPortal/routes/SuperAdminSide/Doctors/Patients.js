const express = require("express");
const router = express.Router();

const profileMod = require("./../../../models/HospitalSide/Doctor/doctor");

router.get("/", async (req, res) => {
  const sess = req.session;
  if (sess.email && sess.password && sess.identifier === "admin") {
    const doctors = await profileMod.find();
    // console.log(doctors); needed
    res.render("SuperAdminSide/Doctors/Doctors", { doctors, msg: "" });
  } else {
    res.redirect("/super-adminLogin");
  }
});

module.exports = router;
