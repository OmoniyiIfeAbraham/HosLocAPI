const express = require("express");
const router = express.Router();

const cloudinary = require("cloudinary");
const mailer = require("nodemailer");

const registerMod = require("./../../models/HospitalSide/Register");
const profileMod = require("./../../models/HospitalSide/Profile/profile");

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

router.post("/:id", async (req, res) => {
  // console.log(req.params.id)
  const id = req.params.id;
  const DOE = req.body.dateOfEstablishment;
  try {
    if (DOE != null) {
      const Liscence = req.files.liscence;
      if (
        Liscence.mimetype == "image/apng" ||
        Liscence.mimetype == "image/avif" ||
        Liscence.mimetype == "image/gif" ||
        Liscence.mimetype == "image/jpeg" ||
        Liscence.mimetype == "image/png" ||
        Liscence.mimetype == "image/svg+xml" ||
        Liscence.mimetype == "image/webp" ||
        Liscence.mimetype == "application/pdf" ||
        Liscence.mimetype == "application/x-pdf" ||
        Liscence.mimetype == "application/x-bzpdf" ||
        Liscence.mimetype == "application/x-gzpdf" ||
        Liscence.mimetype == "applications/vnd.pdf" ||
        Liscence.mimetype == "application/acrobat" ||
        Liscence.mimetype == "application/x-google-chrome-pdf" ||
        Liscence.mimetype == "text/pdf" ||
        Liscence.mimetype == "text/x-pdf" ||
        Liscence.mimetype == "application/msword" ||
        Liscence.mimetype ==
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        Liscence.mimetype ==
          "application/vnd.openxmlformats-officedocument.wordprocessingml.template" ||
        Liscence.mimetype ==
          "application/vnd.ms-word.document.macroEnabled.12" ||
        Liscence.mimetype == "application/vnd.ms-word.template.macroEnabled.12"
      ) {
        const upload = await cloudinary.v2.uploader.upload(
          Liscence.tempFilePath,
          {
            resource_type: "auto",
            folder: process.env.hospitalLiscenceFolder,
            use_filename: false,
            unique_filename: true,
          }
        );
        const person = await registerMod.findOne({ _id: id });
        const profile = new profileMod({
          name: person.name,
          address: person.address,
          phone: person.phone,
          email: person.email,
          picture: person.picture,
          password: person.password,
          picturePublicID: person.picturePublicID,
          uniqueID: person._id,
          dateOfEstablishment: DOE,
          size: person.size,
          liscence: upload.secure_url,
          liscencePublicID: upload.public_id,
        });
        const verify = await profileMod.findOne({ uniqueID: person._id });
        if (verify) {
          cloudinary.v2.uploader.destroy(upload.public_id).then((result) => {
            console.log(result);
          });
          res.render("HospitalSide/Profile/completeProfile", {
            msg: "First profile already submitted",
            check: true,
            id: req.params.id,
          });
        } else {
          await profile.save();
          registerMod
            .findOneAndUpdate({ _id: id }, { completeProfile: true })
            .then((result) => {
              const mail = async () => {
                const mailOption = {
                  from: `${process.env.adminName} ${process.env.email}`,
                  to: "ife04abraham@gmail.com",
                  subject: `Verify Details`,
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
                                                <h1>Verify Details Email</h1>
                                                
                                                <h3>Hello Super Admin,</h3>
                                                
                                                <p style="text-align: center;">${person.name} are waiting for you to review and approve their Liscence Document on HosLoc!!!</p>
                                                                                              
                                                <p style="text-align: center;">Regards,<br>HOSLOC Team</p>
                                              </body>
                                              </html>
                                          `,
                };
                await systemMail.sendMail(mailOption);
              };
              mail();
              res.redirect("/hospital");
            })
            .catch((error) => {
              console.log(error);
              next(error);
            });
        }
      } else {
        res.render("HospitalSide/Profile/completeProfile", {
          msg: "Invalid File Type",
          check: false,
          id: req.params.id,
        });
      }
    } else {
      res.render("HospitalSide/Profile/completeProfile", {
        msg: "Please fill all the fields!",
        check: false,
        id: req.params.id,
      });
    }
  } catch (err) {
    console.log(err);
    res.render("HospitalSide/Profile/completeProfile", {
      msg: "An Error Occured!!!",
      check: false,
      id: req.params.id,
    });
  }
});

module.exports = router;
