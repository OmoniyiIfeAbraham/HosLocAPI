const express = require("express");
const router = express.Router();

const profileMod = require("./../../../models/HospitalSide/Doctor/doctor");
const hospitalMod = require("./../../../models/HospitalSide/Profile/profile");

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

router.post("/addDoctor", async (req, res) => {
  const sess = req.session;
  const address = req.body.address;
  const name = req.body.name;
  const phone = req.body.phone;
  const dob = req.body.dob;
  const password = req.body.password;
  const email = req.body.email;

  try {
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
        res.render("HospitalSide/Doctors/doctors", {
          msg: "Please fIll all Fields Correctly",
        });
      }
    } else {
      res.render("HospitalSide/Doctors/doctors", {
        msg: "Please fill all the fields!",
      });
    }
  } catch (err) {
    console.log(err);
    res.render("HospitalSide/Doctors/doctors", { msg: "An Error Occured!!!" });
  }
});

module.exports = router;
