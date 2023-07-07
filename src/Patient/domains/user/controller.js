const User = require("./model");
const { hashData, verifyHashedData } = require("../../../util/hashData");
const createToken = require("./../../../util/createToken");
const {
  sendVerificationOTPEmail,
} = require("./../email_verification/controller");

const authenticateUser = async (data) => {
  try {
    const { email, password } = data;

    const fetchedUser = await User.findOne({ email });

    if (!fetchedUser) {
      const val = { message: "Invalid email entered!", status: "FAILED" };
      return val;
    }

    if (!fetchedUser.verified) {
      const val = {
        message: "Email hasn't been verified yet. Check your inbox.",
        status: "FAILED",
      };
      return val;
    }

    const hashedPassword = fetchedUser.password;
    const passwordMatch = await verifyHashedData(password, hashedPassword);
    if (!passwordMatch) {
      const val = {
        message: "Invalid password entered!",
        status: "FAILED",
      };
      return val;
    }

    // create user token
    const tokenData = { userId: fetchedUser._id, email };
    const token = await createToken(tokenData);

    // assign user token
    fetchedUser.token = token;
    return { message: "Logged In Successful!", status: "SUCCESS", fetchedUser };
  } catch (error) {
    throw error;
  }
};

const createNewUser = async (data) => {
  try {
    const { name, email, dob, password } = data;

    // checking if user already exists
    const existinguser = await User.findOne({ email });

    if (existinguser) {
      const val = {
        message: "User with the provided email already exists",
        status: "FAILED",
      };
      return val;
    } else if (!(name && email && dob && password)) {
      const val = {
        message: "Empty input fields!",
        status: "FAILED",
      };
      return val;
    } else if (!/^[a-zA-Z ]*$/.test(name)) {
      const val = {
        message: "Invalid name entered",
        status: "FAILED",
      };
      return val;
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      const val = {
        message: "Invalid email entered",
        status: "FAILED",
      };
      return val;
    } else if (password.length < 8) {
      const val = {
        message: "Password is too short!",
        status: "FAILED",
      };
      return val;
    } else {
      // hash password
      const hashedPassword = await hashData(password);
      const newUser = new User({
        name,
        email,
        dob,
        password: hashedPassword,
      });
      // save user
      const createdUser = await newUser.save();
      await sendVerificationOTPEmail(createdUser.email);
      return { message: "Signup Successful", status: "SUCCESS", createdUser };
    }
  } catch (error) {
    throw error;
  }
};

module.exports = { createNewUser, authenticateUser };
