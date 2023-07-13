const mongoose = require('mongoose')

const Schema = mongoose.Schema

const doctorRegister = new Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: String,
    },
    gender: {
        type: String,
        required: true
    },
    specialization: {
        type: String,
        required: true
    },
    dob: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    picture: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    picturePublicID: {
        type: String,
        required: true
    },
    hospital: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('DoctorRegister', doctorRegister)