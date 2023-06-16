const generateOTP = async () => {
  try {
    let otp = `${Math.floor(1000 + Math.random() * 9000)}`;
    console.log(otp);
    return otp;
  } catch (error) {
    throw error;
  }
};

module.exports = generateOTP;
