const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const sess = req.session;
  if (sess.email && sess.password && sess.identifier === "admin") {
    res.render("SuperAdminSide/index");
  } else {
    res.redirect('/super-adminLogin')
  }
});

module.exports = router;
