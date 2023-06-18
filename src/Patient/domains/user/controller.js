const User = require("./model");
const { hashData, verifyHashedData } = require("../../../util/hashData");
const createToken = require("./../../../util/createToken");

const authenticateUser = async (data) => {
  try {
    const { email, password } = data;

    const fetchedUser = await User.findOne({ email });

    if (!fetchedUser) {
      // throw Error("Invalid email entered!");
      res
        .status(400)
        .send({ message: "Invalid email entered!", status: "FAILED" });
    }

    if (!fetchedUser.verified) {
      // throw Error("Email hasn't been verified yet. Check your inbox.");
      res
        .status(400)
        .send({
          message: "Email hasn't been verified yet. Check your inbox.",
          status: "FAILED",
        });
    }

    const hashedPassword = fetchedUser.password;
    const passwordMatch = await verifyHashedData(password, hashedPassword);
    if (!passwordMatch) {
      // throw Error("Invalid password entered!");
      res
        .status(400)
        .send({ message: "Invalid password entered!", status: "FAILED" });
    }

    // create user token
    const tokenData = { userId: fetchedUser._id, email };
    const token = await createToken(tokenData);

    // assign user token
    fetchedUser.token = token;
    return fetchedUser;
  } catch (error) {
    throw error;
  }
};

const createNewUser = async (data) => {
  try {
    const { name, email, dob, password, profilePic, profilePicID } = data;

    // checking if user already exists
    const existinguser = await User.findOne({ email });

    if (existinguser) {
      throw Error("User with the provided email already exists");
    } else {
      // hash password
      const hashedPassword = await hashData(password);
      const newUser = new User({
        name,
        email,
        dob,
        password: hashedPassword,
        profilePic,
        profilePicID,
      });
      // save user
      const createdUser = await newUser.save();
      return createdUser;
    }
  } catch (error) {
    throw error;
  }
};

module.exports = { createNewUser, authenticateUser };
