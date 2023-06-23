const express = require("express");
const router = express.Router();

const profileMod = require("./../../../../Patient/domains/user/model");
const hospitalMod = require("./../../../models/HospitalSide/Profile/profile");

router.get("/", async (req, res) => {
  const sess = req.session;
  if (sess.email && sess.password && sess.identifier === "hospital") {
    const patients = await profileMod.find();
    const you = await hospitalMod.findOne({ email: sess.email });
    // console.log(patients); needed
    res.render("HospitalSide/Patients/patients", {
      patients,
      you,
      unique: you.uniqueID,
      msg: "",
    });
  } else {
    res.redirect("/hospitalLogin");
  }
});

module.exports = router;
