const express = require("express");
const router = express.Router();

const profileMod = require("./../../../models/HospitalSide/Profile/profile");

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const sess = req.session;
  if (sess.email && sess.password && sess.identifier === "admin") {
    const info = await profileMod.findById({ _id: id });
    res.render("SuperAdminSide/Hospitals/viewHospital", { info, msg: "" });
  } else {
    res.redirect("/super-adminLogin");
  }
});

module.exports = router;
