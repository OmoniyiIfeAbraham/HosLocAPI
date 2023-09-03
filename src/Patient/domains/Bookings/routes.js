const express = require("express");
const router = express.Router();
const { createBookingRequest } = require("./controller");
const User = require("./../user/model");

// send request
router.post("/request", async (req, res) => {
  try {
    let { patientID, hospitalID, specialization, message } = req.body;
    patientID = patientID;
    hospitalID = hospitalID;
    specialization = specialization;
    message = message;

    const newBooking = await createBookingRequest({
      patientID,
      hospitalID,
      specialization,
      message,
    });
    res.status(200).json(newBooking);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get("/getPatientID/:email", async (req, res) => {
  try {
    let email = req.params.email;

    const Patient = await User.findOne({ email: email });

    if (Patient) {
      res.status(200).json({ id: Patient._id });
    } else {
      res.status(400).json({ message: "No User Found" });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
