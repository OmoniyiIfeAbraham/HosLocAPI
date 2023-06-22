const mongoose = require('mongoose')

const Schema = mongoose.Schema

const hospitalProfile = new Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    mapInfo: {
        type: String,
        required: true
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
    password: {
        type: String,
        required: true
    },
    picturePublicID: {
        type: String,
        required: true
    },
    uniqueID: {
        type: String,
        required: true,
        unique: true
    },
    dateOfEstablishment: {
        type: String,
        required: true
    },
    certificateOfOccupancy: {
        type: String,
        required: true
    },
    certificateOfOccupancyPublicID: {
        type: String,
        required: true
    },
    certificateOfOccupancyApprove:{
        type: Boolean,
        required: true,
        default: false
    },
    liscence: {
        type: String,
        required: true,
        default: ' '
    },
    liscencePublicID: {
        type: String,
        required: true,
        default: ' '
    },
    liscenceApprove: {
        type: Boolean,
        required: true,
        default: false
    }
})

module.exports = mongoose.model('HospitalProfile', hospitalProfile)