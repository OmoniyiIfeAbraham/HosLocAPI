const express = require("express");
const router = express.Router();

const profileMod = require("./../../../../Patient/domains/user/model");

router.get("/", async (req, res) => {
  const sess = req.session;
  if (sess.email && sess.password && sess.identifier === "admin") {
    const patients = await profileMod.find();
    // console.log(patients); needed
    res.render("SuperAdminSide/Patients/Patients", { patients, msg: "" });
  } else {
    res.redirect("/super-adminLogin");
  }
});

module.exports = router;
