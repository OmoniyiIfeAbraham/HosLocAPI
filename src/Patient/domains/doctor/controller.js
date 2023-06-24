const User = require("./../../../WebPortal/models/HospitalSide/Doctor/doctor");
const createToken = require("./../../../util/createToken");

const authenticateUser = async (data) => {
  try {
    const { email, password } = data;

    const fetchedUser = await User.findOne({ email });

    if (!fetchedUser) {
      const val = { message: "Invalid email entered!", status: "FAILED" };
      return val;
    }

    if (password !== fetchedUser.password) {
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

module.exports = { authenticateUser };
