const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary");
const { createNewUser } = require("./controller");

// Signup
router.post("/signup", async (req, res) => {
  try {
    let { name, email, dob, password } = req.body;
    name = name.trim();
    email = email.trim();
    dob = dob.trim();
    password = password.trim();

    if (!(name && email && dob && password)) {
      throw Error("Empty input fields!");
    } else if (!/^[a-zA-Z ]*$/.test(name)) {
      throw Error("Invalid name entered");
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      throw Error("Invalid email entered");
    } else if (password.length < 8) {
      throw Error("Password is too short!");
    } else {
      const profile = req.files.profilePicture;
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
            folder: process.env.patientProfilePictureFolder,
            use_filename: false,
            unique_filename: true,
          }
        );
        // good credentials, create new user
        const newUser = await createNewUser({
          name,
          email,
          dob,
          password,
          profilePic: upload.secure_url,
          profilePicID: upload.public_id,
        });
        res.status(200).json(newUser);
      } else {
        throw Error("Invalid Image File Type");
      }
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
