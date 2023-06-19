const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  // profilePic: String,
  // profilePicID: String,
  name: String,
  email: { type: String, unique: true },
  dob: String,
  password: String,
  token: String,
  verified: { type: Boolean, default: false },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
