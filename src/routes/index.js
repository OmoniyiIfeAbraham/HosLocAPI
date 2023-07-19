const express = require("express");
const router = express.Router();

const userRoutes = require("./../Patient/domains/user");
const OTPRoutes = require("./../Patient/domains/otp");
const EmailVerificationRoutes = require("./../Patient/domains/email_verification");
const ForgotPasswordRoutes = require("./../Patient/domains/forgot_password");
const hospitalsRoutes = require("./../Patient/domains/hospitals");
const doctorRoutes = require("./../Patient/domains/doctor");

router.use("/user", userRoutes);
router.use("/otp", OTPRoutes);
router.use("/email_verification", EmailVerificationRoutes);
router.use("/forgot_password", ForgotPasswordRoutes);
router.use("/hospitals", hospitalsRoutes);
router.use("/doctor", doctorRoutes);

router.get("/none", (req, res) => {
  const dos = false;
  if (dos == true) {
    res.status(400).send({
      message: "HosLoc is Undergoing Update. Please check back in a few days.",
      status: "FAILED",
    });
  } else {
    res.status(400).send({
      message: "go",
      status: "FAILED",
    });
  }
});

module.exports = router;
