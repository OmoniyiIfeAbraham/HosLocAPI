const express = require("express");
const router = express.Router();
const mailer = require("nodemailer");
const cloudinary = require("cloudinary");

const profileMod = require("./../../../models/HospitalSide/Doctor/doctor");
const hospitalMod = require("./../../../models/HospitalSide/Profile/profile");
const doctorMod = require("./../../../models/HospitalSide/Doctor/doctor");

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

router.get("/", async (req, res) => {
  const sess = req.session;
  if (sess.email && sess.password && sess.identifier === "hospital") {
    const you = await hospitalMod.findOne({ email: sess.email });
    const doctors = await profileMod.find({ hospital: you._id });
    // console.log(doctors); needed
    res.render("HospitalSide/Doctors/doctors", {
      doctors,
      you,
      unique: you.uniqueID,
      msg: "",
    });
  } else {
    res.redirect("/hospitalLogin");
  }
});

router.post("/addDoctor/:id", async (req, res) => {
  const sess = req.session;
  const address = req.body.address;
  const name = req.body.name;
  const phone = req.body.phone;
  const dob = req.body.dob;
  const password = req.body.password;
  const email = req.body.email;
  const gender = req.body.gender;
  const specialization = req.body.specialization;

  try {
    const you = hospitalMod.findById({ _id: req.params.id });
    const doctors = await profileMod.find({ hospital: req.params.id });
    if (
      address != null &&
      name != null &&
      password != null &&
      dob != null &&
      phone != null &&
      email != null &&
      gender != null &&
      specialization != null &&
      req.files != null
    ) {
      if (address.length >= 3 && name.length >= 3 && password.length >= 6) {
        const verifyMail = await profileMod.findOne({
          email: req.body.email,
        });
        if (verifyMail) {
          res.render("HospitalSide/Doctors/doctors", {
            doctors,
            you,
            unique: you.uniqueID,
            msg: "Doctor with this Email already exists",
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
                folder: process.env.doctorProfilePictureFolder,
                use_filename: false,
                unique_filename: true,
              }
            );
            const doctor = new doctorMod({
              picture: upload.secure_url,
              name: name,
              address: address,
              phone: phone,
              gender: gender,
              specialization: specialization,
              dob: dob,
              password: password,
              email: email,
              picturePublicID: upload.public_id,
              hospital: req.params.id,
            });
            await doctor.save();
            const mailOption = {
              from: `${process.env.adminName} ${process.env.email}`,
              to: email,
              subject: `Hello Dr. ${name}`,
              html: `
                                                <html>
                                                <head>
                                                  <style>
                                                    body {
                                                      font-family: Arial, sans-serif;
                                                    }
                                                    
                                                    h1 {
                                                      text-align: center;
                                                    }
                                                    
                                                    h3 {
                                                      text-align: center;
                                                      margin-top: 30px;
                                                    }
                                                    
                                                    .otp-code {
                                                      font-size: 36px;
                                                      font-weight: bold;
                                                      text-align: center;
                                                      margin-top: 40px;
                                                      margin-bottom: 50px;
                                                    }
                                                  </style>
                                                </head>
                                                <body>
                                                  <h1>Login Credentials Email</h1>
                                                  
                                                  <h3>Hello ${name},</h3>
                                                  
                                                  <p style="text-align: center;">Find below your login credentials for your HosLoc App...</p>
                                                  
                                                  <div class="otp-code">
                                                  Email: ${email}
                                                  Password: ${password}
                                                  </div>
                                                                                                                                                    
                                                  <p style="text-align: center;">Regards,<br>HOSLOC Team</p>
                                                </body>
                                                </html>
                                            `,
            };
            await systemMail.sendMail(mailOption);
            res.redirect("/viewDoctors");
          } else {
            res.render("HospitalSide/Doctors/doctors", {
              doctors,
              you,
              unique: you.uniqueID,
              msg: "Invalid Image File Type",
            });
          }
        }
      } else {
        res.render("HospitalSide/Doctors/doctors", {
          doctors,
          you,
          unique: you.uniqueID,
          msg: "Please fIll all Fields Correctly",
        });
      }
    } else {
      res.render("HospitalSide/Doctors/doctors", {
        doctors,
        you,
        unique: you.uniqueID,
        msg: "Please fill all the fields!",
      });
    }
  } catch (err) {
    console.log(err);
    res.render("HospitalSide/Doctors/doctors", {
      doctors,
      you,
      unique: you.uniqueID,
      msg: "An Error Occured!!!",
    });
  }
});

router.get("/view/:id", async (req, res) => {
  const sess = req.session;
  if (sess.email && sess.password && sess.identifier === "hospital") {
    const doctor = await profileMod.findOne({ _id: req.params.id });
    const you = await hospitalMod.findOne({ email: sess.email });
    // console.log(doctor); needed
    res.render("HospitalSide/Doctors/view", {
      doctor,
      you,
      unique: you.uniqueID,
      msg: "",
    });
  } else {
    res.redirect("/hospitalLogin");
  }
});

module.exports = router;
