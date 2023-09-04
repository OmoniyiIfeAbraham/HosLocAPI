const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const appointment = new Schema({
  patientID: {
    type: String,
    required: true,
  },
  doctorID: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Appointment", appointment);
