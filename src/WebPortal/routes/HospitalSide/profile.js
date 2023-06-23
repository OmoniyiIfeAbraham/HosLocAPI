const express = require("express");
const router = express.Router();

const registerMod = require("./../../models/HospitalSide/Register");
const profileMod = require("./../../models/HospitalSide/Profile/profile");
const patientMod = require("./../../../Patient/domains/user/model");
// const scheduleMod = require("./../../../models/doctor/schedule/schedule");

router.get("/", async (req, res) => {
  const sess = req.session;
  console.log(sess);
  if (sess.email && sess.password && sess.identifier === "hospital") {
    try {
      const profile = await registerMod.findOne({ email: sess.email });
      const you = await profileMod.findOne({ email: sess.email });
      console.log(profile._id);
      const person = await profileMod.findOne({ uniqueID: profile._id });
      if (profile.completeProfile == false) {
        const id = profile._id;
        res.render("HospitalSide/Profile/completeProfile", {
          id,
          check: false,
          msg: "",
        });
      } else if (you.liscenceApprove == true) {
        const patients = await patientMod.find();
        // const schedules = await scheduleMod.find({ doctor: you._id });
        // console.log(schedules);
        res.render("HospitalSide/Profile/profile", {
          id: person._id,
          unique: profile._id,
          you,
          patients
        });
      } else {
        res.render("HospitalSide/Profile/waiting");
      }
    } catch (err) {
      console.log(err);
      res.render("HospitalSide/login", { msg: "An Error Occured!!!" });
    }
  } else {
    res.redirect("/hospitalLogin");
  }
});

module.exports = router;
