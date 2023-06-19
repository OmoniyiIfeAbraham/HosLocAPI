const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary");
const { createNewUser, authenticateUser } = require("./controller");
const auth = require("./../../../middleware/auth");
const {
  sendVerificationOTPEmail,
} = require("./../email_verification/controller");

// protected route
router.get("/private_data", auth, (req, res) => {
  res
    .status(200)
    .send(`You're in the private territory of ${req.currentUser.email}`);
});

// login
router.post("/", async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email.trim();
    password = password.trim();

    if (!(email && password)) {
      // throw Error("Empty credentials supllied!");
      res
        .status(400)
        .send({ message: "Empty credentials supllied!", status: "FAILED" });
    }

    const authenticatedUser = await authenticateUser({ email, password });

    res.status(200).json({
      authenticatedUser,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Signup
router.post("/signup", async (req, res) => {
  try {
    let { name, email, dob, password } = req.body;
    name = name.trim();
    email = email.trim();
    dob = dob.trim();
    password = password.trim();

    // if (!(name && email && dob && password)) {
    //   // throw Error("Empty input fields!");
    //   res
    //     .status(400)
    //     .json({ message: "Empty input fields!", status: "FAILED" });
    // } else if (!/^[a-zA-Z ]*$/.test(name)) {
    //   // throw Error("Invalid name entered");
    //   res
    //     .status(400)
    //     .json({ message: "Invalid name entered", status: "FAILED" });
    // } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    //   // throw Error("Invalid email entered");
    //   res
    //     .status(400)
    //     .json({ message: "Invalid email entered", status: "FAILED" });
    // } else if (password.length < 8) {
    //   // throw Error("Password is too short!");
    //   res
    //     .status(400)
    //     .json({ message: "Password is too short!", status: "FAILED" });
    // } else {
    // const profile = req.files.profilePicture;
    // if (
    //   profile.mimetype == "image/apng" ||
    //   profile.mimetype == "image/avif" ||
    //   profile.mimetype == "image/gif" ||
    //   profile.mimetype == "image/jpeg" ||
    //   profile.mimetype == "image/png" ||
    //   profile.mimetype == "image/svg+xml" ||
    //   profile.mimetype == "image/webp"
    // ) {
    //   const upload = await cloudinary.v2.uploader.upload(
    //     profile.tempFilePath,
    //     {
    //       resource_type: "image",
    //       folder: process.env.patientProfilePictureFolder,
    //       use_filename: false,
    //       unique_filename: true,
    //     }
    //   );
    // good credentials, create new user
    const newUser = await createNewUser({
      name,
      email,
      dob,
      password,
      // profilePic: upload.secure_url,
      // profilePicID: upload.public_id,
    });
    res.status(200).json(newUser);
    // } else {
    //   // throw Error("Invalid Image File Type");
    //   res
    //     .status(400)
    //     .send({ message: "Invalid Image File Type", status: "FAILED" });
    // }
    // }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
