const express = require("express");
const router = express.Router();

const hospitalsMod = require("./../../../WebPortal/models/HospitalSide/Profile/profile");
const doctorMod = require("./../../../WebPortal/models/HospitalSide/Doctor/doctor");

router.get("/", async (req, res) => {
  try {
    const hospitals = await hospitalsMod.find().limit(3);
    res.status(200).json(hospitals);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get("/doctors/:id", async (req, res) => {
  try {
    const doctors = await doctorMod.find({ hospital: req.params.id });
    res.status(200).json(doctors);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get("/all", async (req, res) => {
  try {
    const hospitals = await hospitalsMod.find();
    res.status(200).json(hospitals);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get("/doctors", async (req, res) => {
  try {
    const doctors = await doctorMod.find({});
    res.status(200).json(doctors);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
