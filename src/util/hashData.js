const bcrypt = require("bcrypt");

const hashData = async (data, saltRounds = 10) => {
  try {
    const hasahedData = await bcrypt.hash(data, saltRounds);
    return hasahedData;
  } catch (error) {
    throw error;
  }
};

module.exports = { hashData };
