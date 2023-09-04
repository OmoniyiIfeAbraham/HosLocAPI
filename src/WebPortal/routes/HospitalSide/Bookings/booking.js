const express = require("express");
const router = express.Router();
const mailer = require("nodemailer");

const profileMod = require("./../../../models/HospitalSide/Doctor/doctor");
const hospitalMod = require("./../../../models/HospitalSide/Profile/profile");
const appointmentMod = require("./../../../models/HospitalSide/Appointment/appointment");
const requestMod = require("./../../../../Patient/domains/Bookings/model");
const userMod = require("./../../../../Patient/domains/user/model");

const systemMail = mailer.createTransport({
  service: process.env.service,
  host: process.env.host,
  port: 465,
  auth: {
    user: process.env.email,
    pass: process.env.pass,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

router.get("/", async (req, res) => {
  const sess = req.session;
  if (sess.email && sess.password && sess.identifier === "hospital") {
    const you = await hospitalMod.findOne({ email: sess.email });
    const requests = await requestMod.find({
      hospitalID: you._id,
      accepted: false,
    });
    const users = await userMod.find();
    const doctors = await profileMod.find({ hospital: you._id });
    // console.log(doctors); needed
    res.render("HospitalSide/Bookings/bookings", {
      requests,
      you,
      unique: you.uniqueID,
      msg: "",
      users,
      doctors,
    });
  } else {
    res.redirect("/hospitalLogin");
  }
});

router.post("/setAppointment/:id/:user", async (req, res) => {
  const sess = req.session;
  const you = await hospitalMod.findOne({ email: sess.email });
  const doctors = await profileMod.find({ hospital: you._id });

  const time = req.body.time;
  const doctor = req.body.doctor;
  const user = req.params.user;

  console.log(time, doctor, user);

  try {
    // const you = hospitalMod.findById({ _id: req.params.id });
    // const doctors = await profileMod.find({ hospital: req.params.id });
    if (time != null && doctor != null && user != null) {
      const appointment = new appointmentMod({
        patientID: user,
        doctorID: doctor,
        time: time,
      });
      await appointment.save();
      requestMod
        .findOneAndUpdate(
          { hospitalID: you._id, accepted: false },
          { accepted: true }
        )
        .then((result) => {
          console.log(result);
        });
      res.redirect("/viewBookings");
    } else {
      res.render("HospitalSide/Doctors/doctors", {
        doctors,
        you,
        unique: you.uniqueID,
        msg: "Please fill all the fields!",
      });
    }
  } catch (err) {
    console.log(err);
    res.render("HospitalSide/Doctors/doctors", {
      doctors,
      you,
      unique: you.uniqueID,
      msg: "An Error Occured!!!",
    });
  }
});

router.get("/deleteBooking/:id", async (req, res, next) => {
  const id = req.params.id;
  const sess = req.session;
  if (sess.email && sess.password && sess.identifier === "hospital") {
    const you = await hospitalMod.findOne({ email: sess.email });
    const doctors = await profileMod.find({ hospital: you._id });
    try {
      requestMod
        .findByIdAndDelete({ _id: id })
        .then((result) => {
          console.log(result);
          res.redirect("/viewBookings");
        })
        .catch((error) => {
          console.log(error);
          next(error);
        });
    } catch (err) {
      console.log(err);
      res.render("HospitalSide/Doctors/doctors", {
        doctors,
        you,
        unique: you.uniqueID,
        msg: "An Error Occured!!!",
      });
    }
  } else {
    res.redirect("/hospitalLogin");
  }
});

module.exports = router;
