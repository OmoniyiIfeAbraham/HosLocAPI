const express = require("express");
const router = express.Router();

const userRoutes = require("./../Patient/domains/user");
const OTPRoutes = require("./../Patient/domains/otp");
const EmailVerificationRoutes = require("./../Patient/domains/email_verification");
const ForgotPasswordRoutes = require("./../Patient/domains/forgot_password");

router.use("/user", userRoutes);
router.use("/otp", OTPRoutes);
router.use("/email_verification", EmailVerificationRoutes);
router.use("/forgot_password", ForgotPasswordRoutes);

module.exports = router;
