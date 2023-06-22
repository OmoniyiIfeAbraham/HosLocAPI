const mongoose = require('mongoose')

const Schema = mongoose.Schema

const hospitalRegister = new Schema({
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
    size: {
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
    completeProfile: {
        type: Boolean,
        default: false
    },
    verified: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        required: true
    },
    picturePublicID: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('HospitalRegister', hospitalRegister)