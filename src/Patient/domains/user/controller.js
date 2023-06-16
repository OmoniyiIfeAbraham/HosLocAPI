const User = require("./model");
const { hashData } = require("../../../util/hashData");

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

module.exports = { createNewUser };
