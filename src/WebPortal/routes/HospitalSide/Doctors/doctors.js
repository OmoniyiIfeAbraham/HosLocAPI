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
    const doctors = await profileMod.find();
    const you = await hospitalMod.findOne({ email: sess.email });
    console.log(doctors);
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

  try {
    const you = hospitalMod.findById({ _id: req.params.id });
    const doctors = await profileMod.find();
    if (
      address != null &&
      name != null &&
      password != null &&
      dob != null &&
      phone != null &&
      email != null &&
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
              dob: dob,
              password: password,
              email: email,
              picturePublicID: upload.public_id,
            });
            await doctor.save();
            const mailOption = {
              from: `${process.env.adminName} ${process.env.email}`,
              to: email,
              subject: `Hello Dr. ${name}`,
              html: `
                                                <body>
                                                    <center><h1> Find below your login credentials for your HosLoc App...</h1></center>
                                                    <center><h3>Email: ${email}</h3></center>
                                                    <center><h3>Password: ${password}</h3></center>
                                                </body>
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
      const doctor = await profileMod.findOne({_id: req.params.id});
      const you = await hospitalMod.findOne({ email: sess.email });
      console.log(doctor);
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
