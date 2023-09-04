const express = require("express");
const router = express.Router();

const cloudinary = require("cloudinary");

const mailer = require("nodemailer");

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

const hospitalMod = require("./../../../models/HospitalSide/Profile/profile");
const registerMod = require("./../../../models/HospitalSide/Doctor/doctor");

router.get("/:id", async (req, res, next) => {
  const id = req.params.id;
  const sess = req.session;
  if (sess.email && sess.password && sess.identifier === "hospital") {
    const doctors = await registerMod.find();
    const you = await hospitalMod.findOne({ email: sess.email });
    try { 
      const register = await registerMod.findById({ _id: id });
      //   console.log(register); needed
      const registerPublicID = register.picturePublicID;
      registerMod
        .findByIdAndDelete({ _id: id })
        .then((result) => {
          cloudinary.v2.uploader.destroy(registerPublicID).then((result) => {
            console.log(result);
          });
          async function mail() {
            const mailOption = {
              from: `${process.env.adminName} ${process.env.email}`,
              to: register.email,
              subject: `${register.name} ACCOUNT`,
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
                                                          <h1>Notification Email</h1>
                                                          
                                                          <h3>Hello Dr. ${register.name},</h3>
                                                          
                                                          <p style="text-align: center;">Your Account has been Deleted</p>
                                                                         
                                                                                                                   
                                                          <p style="text-align: center;">Regards,<br>HOSLOC Team</p>
                                                        </body>
                                                        </html>
                                                    `,
            };
            await systemMail.sendMail(mailOption);
          }
          mail();
          res.redirect("/hospital");
        })
        .catch((error) => {
          console.log(error);
          next(error);
        });
    } catch (err) {
      console.log(err);
      res.render("HospitalSide/Doctors/doctors", {
        doctors,
        you,
        unique: you.uniqueID,
        msg: "An Error Occured!!!",
      });
    }
  } else {
    res.redirect("/hospitalLogin");
  }
});

module.exports = router;
