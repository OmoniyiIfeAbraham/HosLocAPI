const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookingSchema = new Schema({
  patientID: { type: String, required: true },
  accepted: { type: Boolean, default: false },
  hospitalID: { type: String, required: true },
  specialization: { type: String, required: true },
  message: { type: String, required: true },
});

const Booking = mongoose.model("Booking", BookingSchema);

module.exports = Booking;
