const express = require("express");
const router = express.Router();
const { createBookingRequest } = require("./controller");

// send request
router.post("/request", async (req, res) => {
  try {
    let { patientID, patientName, hospitalID, specialization, message } =
      req.body;
    patientID = patientID;
    patientName = patientName;
    hospitalID = hospitalID;
    specialization = specialization;
    message = message;

    const newBooking = await createBookingRequest({
      patientID,
      patientName,
      hospitalID,
      specialization,
      message,
    });
    res.status(200).json(newBooking);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
