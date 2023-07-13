const express = require("express");
const router = express.Router();

const mailer = require("nodemailer");
const cloudinary = require("cloudinary");

const profileMod = require("./../../../models/HospitalSide/Profile/profile");
const authMod = require("./../../../models/HospitalSide/auth");
const registerMod = require("./../../../models/HospitalSide/Register");
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

router.get("/liscence/:id", async (req, res, next) => {
  const sess = req.session;
  if (sess.email && sess.password && sess.identifier === "admin") {
    try {
      const id = req.params.id;
      const locate = await profileMod.findById({ _id: id });
      // console.log(locate); needed
      profileMod
        .findByIdAndUpdate({ _id: id }, { liscenceApprove: true })
        .then((result) => {
          async function mail() {
            const mailOption = {
              from: `${process.env.adminName} ${process.env.email}`,
              to: locate.email,
              subject: `${locate.name} LISCENCE APPROVE`,
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
                                
                                <h3>Hello ${locate.name},</h3>
                                
                                <p style="text-align: center;">Your Work Liscence has been Approved</p>
                                                                                  
                                <p style="text-align: center;">Regards,<br>HOSLOC Team</p>
                              </body>
                              </html>
                          `,
            };
            await systemMail.sendMail(mailOption);
          }
          mail();
          res.redirect("/super-admin");
        })
        .catch((error) => {
          console.log(error);
          next(error);
        });
    } catch (err) {
      console.log(err);
      res.render("SuperAdminSide/Hospitals/viewHospital", {
        msg: "An Error Occured!!!",
      });
    }
  } else {
    res.redirect("/super-adminLogin");
  }
});

router.get("/revoke/:id", async (req, res, next) => {
  const sess = req.session;
  if (sess.email && sess.password && sess.identifier === "admin") {
    try {
      const id = req.params.id;
      const locate = await profileMod.findById({ _id: id });
      // console.log(locate); needed
      profileMod
        .findByIdAndUpdate({ _id: id }, { liscenceApprove: false })
        .then((result) => {
          async function mail() {
            const mailOption = {
              from: `${process.env.adminName} ${process.env.email}`,
              to: locate.email,
              subject: `${locate.name} DOCUMENTS REVOKED`,
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
                                
                                <h3>Hello ${locate.name},</h3>
                                
                                <p style="text-align: center;">Your Work Liscence Approval has been Revoked</p>
                                                                                  
                                <p style="text-align: center;">Regards,<br>HOSLOC Team</p>
                              </body>
                              </html>
                          `,
            };
            await systemMail.sendMail(mailOption);
          }
          mail();
          res.redirect("/super-admin");
        })
        .catch((error) => {
          console.log(error);
          next(error);
        });
    } catch (err) {
      console.log(err);
      res.render("SuperAdminSide/Hospitals/viewHospital", {
        msg: "An Error Occured!!!",
      });
    }
  } else {
    res.redirect("/super-adminLogin");
  }
});

router.get("/decline/:id", async (req, res, next) => {
  const sess = req.session;
  if (sess.email && sess.password && sess.identifier === "admin") {
    try {
      const id = req.params.id;
      const person = await profileMod.findById({ _id: id });
      // console.log(person); needed
      const auth = await authMod.findOne({ uniqueID: person.uniqueID });
      // console.log(auth); needed
      const register = await registerMod.findOne({ _id: person.uniqueID });
      // console.log(register); needed
      const registerPublicID = register.profilePublicID;
      const liscencePublicID = person.liscencePublicID;
      authMod
        .findOneAndDelete({ uniqueID: person.uniqueID })
        .then((result) => {
          registerMod
            .findByIdAndDelete({ _id: person.uniqueID })
            .then((result) => {
              cloudinary.v2.uploader
                .destroy(registerPublicID)
                .then((result) => {
                  console.log(result);
                });
              profileMod
                .findByIdAndDelete({ _id: id })
                .then((result) => {
                  cloudinary.v2.uploader
                    .destroy(liscencePublicID)
                    .then((result) => {
                      console.log(result);
                    });
                  doctorMod.deleteMany({ hospital: id }).then((result) => {
                    console.log('Doctors Deleted Succesfully')
                  });
                  async function mail() {
                    const mailOption = {
                      from: `${process.env.adminName} ${process.env.email}`,
                      to: person.email,
                      subject: `${person.name} ACCOUNT`,
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
                                                    
                                                    <h3>Hello ${person.name},</h3>
                                                    
                                                    <p style="text-align: center;">Your Account has been Deleted Due to Wrong Liscence Documents</p>
                                                                                                      
                                                    <p style="text-align: center;">Regards,<br>HOSLOC Team</p>
                                                  </body>
                                                  </html>
                                              `,
                    };
                    await systemMail.sendMail(mailOption);
                  }
                  mail();
                  res.redirect("/super-admin");
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
        })
        .catch((error) => {
          console.log(error);
          next(error);
        });
    } catch (err) {
      console.log(err);
      res.render("SuperAdminSide/Hospitals/viewHospital", {
        msg: "An Error Occured!!!",
      });
    }
  } else {
    res.redirect("/super-adminLogin");
  }
});

module.exports = router;
