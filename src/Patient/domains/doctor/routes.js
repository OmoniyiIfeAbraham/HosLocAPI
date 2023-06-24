const express = require("express");
const router = express.Router();
const { authenticateUser } = require("./controller");

const doctorMod = require("./../../../WebPortal/models/HospitalSide/Doctor/doctor");
const hospitalMod = require("./../../../WebPortal/models/HospitalSide/Profile/profile");

// login
router.post("/", async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email.trim();
    password = password.trim();

    if (!(email && password)) {
      res
        .status(400)
        .send({ message: "Empty credentials supllied!", status: "FAILED" });
    }

    const authenticatedUser = await authenticateUser({ email, password });

    res.status(200).json({
      authenticatedUser,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get("/hospital/:hospital", async (req, res) => {
  try {
    const hospital = await hospitalMod.findById({ _id: req.params.hospital });
    const doctors = await doctorMod.find({ hospital: hospital._id });
    res.status(200).json({ hospital, doctors });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
