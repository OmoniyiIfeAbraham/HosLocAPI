const express = require("express");
const router = express.Router();

const userRoutes = require("./../Patient/domains/user");
const OTPRoutes = require("./../Patient/domains/otp");

router.use("/user", userRoutes);
router.use("/otp", OTPRoutes);

module.exports = router;
