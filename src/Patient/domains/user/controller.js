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
      // throw Error("Invalid email entered!");
      // throw Error({ message: "Invalid email entered!", status: "FAILED" });
      // res
      //   .status(400)
      //   .send({ message: "Invalid email entered!", status: "FAILED" });
    }

    if (!fetchedUser.verified) {
      // throw Error("Email hasn't been verified yet. Check your inbox.");
      const val = {
        message: "Email hasn't been verified yet. Check your inbox.",
        status: "FAILED",
      };
      return val;
      // res.status(400).send({
      //   message: "Email hasn't been verified yet. Check your inbox.",
      //   status: "FAILED",
      // });
    }

    const hashedPassword = fetchedUser.password;
    const passwordMatch = await verifyHashedData(password, hashedPassword);
    if (!passwordMatch) {
      // throw Error("Invalid password entered!");
      const val = {
        message: "Invalid password entered!",
        status: "FAILED",
      };
      return val;
      // res
      //   .status(400)
      //   .send({ message: "Invalid password entered!", status: "FAILED" });
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
    // const { name, email, dob, password, profilePic, profilePicID } = data;
    const { name, email, dob, password } = data;

    // checking if user already exists
    const existinguser = await User.findOne({ email });

    if (existinguser) {
      // throw Error("User with the provided email already exists");
      const val = {
        message: "User with the provided email already exists",
        status: "FAILED",
      };
      return val;
    } else if (!(name && email && dob && password)) {
      // throw Error("Empty input fields!");
      const val = {
        message: "Empty input fields!",
        status: "FAILED",
      };
      return val;
    } else if (!/^[a-zA-Z ]*$/.test(name)) {
      // throw Error("Invalid name entered");
      const val = {
        message: "Invalid name entered",
        status: "FAILED",
      };
      return val;
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      // throw Error("Invalid email entered");
      const val = {
        message: "Invalid email entered",
        status: "FAILED",
      };
      return val;
    } else if (password.length < 8) {
      // throw Error("Password is too short!");
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
        // profilePic,
        // profilePicID,
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
