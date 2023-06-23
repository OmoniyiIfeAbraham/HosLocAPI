const express = require("express");
const router = express.Router();

const hospitalsMod = require("./../../../WebPortal/models/HospitalSide/Profile/profile");

router.get('/', async(req, res) => {
try {
    const hospitals = await hospitalsMod.find()
    res.status(200).json(hospitals)
} catch (error) {
    res.status(400).send(error.message);
}
})

module.exports = router;
