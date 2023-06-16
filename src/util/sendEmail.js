const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: process.env.service,
  host: process.env.host,
  port: 465,
  auth: { user: process.env.email, pass: process.env.pass },
  tls: {
    rejectUnauthorized: false,
  },
});

// test transporter
transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Ready for messages");
    console.log(success);
  }
});

const sendEmail = async (mailOptions) => {
  try {
    await transporter.sendMail(mailOptions);
    return;
  } catch (error) {
    throw error;
  }
};

module.exports = sendEmail;
