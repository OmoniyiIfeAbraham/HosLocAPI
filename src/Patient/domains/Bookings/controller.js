const Booking = require("./model");
const User = require("./../user/model");

const createBookingRequest = async (data) => {
  try {
    const { patientID, hospitalID, specialization, message } = data;

    // checking if user already exists
    const existinguser = await User.findById(patientID);

    if (!(patientID && hospitalID && specialization && message)) {
      const val = {
        message: "Empty Request Cannot Be sent!",
        status: "FAILED",
      };
      return val;
    } else if (!existinguser) {
      const val = {
        message:
          "You cannot Send This Boking Request Unless you are a Registered User of HosLoc",
        status: "FAILED",
      };
      return val;
    } else {
      const newBooking = new Booking({
        patientID,
        hospitalID,
        specialization,
        message,
      });
      //   save booking request
      const createdBooking = await newBooking.save();
      return {
        message: "Booking Request Successfully Sent",
        status: "SUCCESS",
        createdBooking,
      };
    }
  } catch (error) {
    throw error;
  }
};

module.exports = { createBookingRequest };
