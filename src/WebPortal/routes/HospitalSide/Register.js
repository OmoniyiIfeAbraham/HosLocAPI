const express = require("express");
const router = express.Router();

const registerMod = require("./../../models/HospitalSide/Register");
const authMod = require("./../../models/HospitalSide/auth");

const cloudinary = require("cloudinary");
const bcrypt = require("bcrypt");
const token = require("@supercharge/strings");
const mailer = require("nodemailer");
const crypto = require("crypto");
const { error } = require("console");

const systemMail = mailer.createTransport({
  service: process.env.service,
  host: process.env.host,
  port: 465,
  auth: {
    user: process.env.email,
    pass: process.env.pass,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

router.get("/", (req, res) => {
  res.render("HospitalSide/register", { msg: "" });
});

router.post("/", async (req, res) => {
  const sess = req.session;
  // console.log(req.body)
  const address = req.body.address;
  const name = req.body.name;
  const phone = req.body.phone;
  const types = req.body.types;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const size = req.body.size;
  const email = req.body.email;

  console.log(address);
  console.log(name);
  console.log(phone);
  console.log(types);
  console.log(password);
  console.log(confirmPassword);
  console.log(size);
  console.log(email);

  // Check if the selected location is a hospital or healthcare-related establishment
  const isHospital = types.includes("hospital");
  const isClinic = types.includes("clinic");
  const isHealthcare = types.includes("health");

  function generateOTP(length) {
    const digits = "0123456789";
    let OTP = "";

    for (let i = 0; i < length; i++) {
      OTP += digits[Math.floor(Math.random() * digits.length)];
    }

    return OTP;
  }

  try {
    if (
      address != null &&
      name != null &&
      password != null &&
      confirmPassword != null &&
      size != null &&
      email != null &&
      req.files != null
    ) {
      if (isHospital || isClinic || isHealthcare) {
        if (address.length >= 3 && name.length >= 3 && password.length >= 6) {
          if (password == confirmPassword) {
            const verifyMail = await registerMod.findOne({
              email: req.body.email,
            });
            if (verifyMail) {
              res.render("HospitalSide/register", {
                msg: "User with this Email already exists",
              });
            } else {
              const profile = req.files.picture;
              if (
                profile.mimetype == "image/apng" ||
                profile.mimetype == "image/avif" ||
                profile.mimetype == "image/gif" ||
                profile.mimetype == "image/jpeg" ||
                profile.mimetype == "image/png" ||
                profile.mimetype == "image/svg+xml" ||
                profile.mimetype == "image/webp"
              ) {
                const upload = await cloudinary.v2.uploader.upload(
                  profile.tempFilePath,
                  {
                    resource_type: "image",
                    folder: process.env.hospitalPictureFolder,
                    use_filename: false,
                    unique_filename: true,
                  }
                );
                const hospital = new registerMod({
                  picture: upload.secure_url,
                  name: name,
                  address: address,
                  phone: phone,
                  size: size,
                  password: bcrypt.hashSync(password, 10),
                  email: email,
                  picturePublicID: upload.public_id,
                });
                const saveHospital = await hospital.save();
                // const otpVal = token.random(4);
                const otpVal = generateOTP(4);
                console.log(otpVal);
                const auth = new authMod({
                  uniqueID: saveHospital._id,
                  email: saveHospital.email,
                  otp: otpVal,
                });
                await auth.save();
                sess.email = req.body.email;
                sess.password = req.body.password;
                const mailOption = {
                  from: `${process.env.adminName} ${process.env.email}`,
                  to: email,
                  subject: `${name} OTP`,
                  html: `
                                              <body>
                                                  <center><h3>Hello ${name} your OTP is...</h3></center>
                                                  <center><h1>${otpVal}</h1></center>
                                              </body>
                                          `,
                };
                await systemMail.sendMail(mailOption);
                res.redirect("/hospitalRegister/otp");
              } else {
                res.render("HospitalSide/register", {
                  msg: "Invalid Image File Type",
                });
              }
            }
          } else {
            res.render("HospitalSide/register", {
              msg: "Password and Confirm Password has to be the same",
            });
          }
        } else {
          res.render("HospitalSide/register", {
            msg: "Please fIll all Fields Correctly",
          });
        }
      } else {
        res.render("HospitalSide/register", {
          msg: "Selected location is not a hospital or healthcare center!!!",
        });
      }
    } else {
      res.render("HospitalSide/register", {
        msg: "Please fill all the fields!",
      });
    }
  } catch (err) {
    console.log(err);
    res.render("HospitalSide/register", { msg: "An Error Occured!!!" });
  }
});

router.get("/otp", (req, res) => {
  const sess = req.session;
  console.log(sess);
  if (sess.email && sess.password) {
    res.render("HospitalSide/otp", { msg: "" });
  } else {
    res.redirect("/");
  }
});

router.post("/otp", async (req, res, next) => {
  const sess = req.session;
  console.log(sess);
  const one = req.body.a;
  const two = req.body.b;
  const three = req.body.c;
  const four = req.body.d;
  const OTP = `${one}${two}${three}${four}`;
  if (sess.email && sess.password) {
    try {
      const hospitalAuth = await authMod.findOne({ email: sess.email });
      const hospitalReg = await registerMod.findOne({ email: sess.email });
      if (hospitalAuth && hospitalReg) {
        if (OTP != null) {
          const check = await authMod.findOne({ email: sess.email });
          if (OTP !== check.otp) {
            res.render("HospitalSide/otp", { msg: "Incorrect OTP" });
          } else {
            authMod
              .findOneAndUpdate({ email: sess.email }, { verified: true })
              .then((result) => {
                registerMod
                  .findOneAndUpdate({ email: sess.email }, { verified: true })
                  .then((result) => {
                    sess.identifier = "hospital";
                    console.log(sess);
                    res.redirect("/hospital");
                  })
                  .catch((error) => {
                    console.log(error);
                    next(error);
                  });
              })
              .catch((error) => {
                console.log(error);
                next(error);
              });
            // authMod.findOneAndUpdate(
            //   { email: sess.email },
            //   { verified: true },
            //   (err, docs) => {
            //     if (err) {
            //       console.log(err);
            //       next(err);
            //     } else {
            //       registerMod.findOneAndUpdate(
            //         { email: sess.email },
            //         { verified: true },
            //         (err, docs) => {
            //           if (err) {
            //             console.log(err);
            //             next(err);
            //           } else {
            //             sess.identifier = "hospital";
            //             console.log(sess);
            //             res.redirect("/hospital");
            //           }
            //         }
            //       );
            //     }
            //   }
            // );
          }
        } else {
          res.render("HospitalSide/otp", { msg: "OTP cannot be Empty" });
        }
      } else {
        sess.destroy();
        res.redirect("/");
      }
    } catch (err) {
      console.log(err);
      res.render("HospitalSide/otp", { msg: "An Error Occured!!!" });
    }
  } else {
    res.redirect("/");
  }
});

module.exports = router;
