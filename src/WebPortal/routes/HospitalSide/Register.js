const express = require('express')
const router = express.Router()

const registerMod = require('./../../models/HospitalSide/Register')
const authMod = require('./../../models/HospitalSide/auth')

const cloudinary = require('cloudinary')
const bcrypt = require('bcrypt')
const token = require('@supercharge/strings')
const mailer = require('nodemailer')

const systemMail = mailer.createTransport({
    service: process.env.service,
    host: process.env.host,
    port: 465,
    auth: {
        user: process.env.email,
        pass: process.env.pass
    },
    tls: {
        rejectUnauthorized: false
    }
})

router.get('/', (req, res) => {
    res.render('HospitalSide/register', { msg: '' })
})

router.post('/', async(req, res) => {
    const sess = req.session
    // console.log(req.body)
    const Firstname = req.body.firstname
    const Lastname = req.body.lastname
    const Password = req.body.password
    const confirmPassword = req.body.confirmPassword
    const Gender = req.body.gender
    const Email = req.body.email
    try {
        if (Firstname != null && Lastname != null && Password != null && confirmPassword != null && Email != null && Gender != null && req.files != null) {
            if (Firstname.length >= 3 && Lastname.length >= 3 && Password.length >= 6) {
                if (Password == confirmPassword) {
                    const verifyMail = await registerMod.findOne({ email: req.body.email })
                    if (verifyMail) {
                        res.render('doctor/auth/register', { msg: 'User with this Email already exists' })
                    } else {
                        const profile = req.files.profilePicture
                        if (profile.mimetype=='image/apng' || profile.mimetype=='image/avif' ||profile.mimetype=='image/gif' || profile.mimetype=='image/jpeg' || profile.mimetype=='image/png' || profile.mimetype=='image/svg+xml' || profile.mimetype=='image/webp') {
                            const upload = await cloudinary.v2.uploader.upload(profile.tempFilePath, { resource_type: 'image', folder: process.env.doctorProfilePictureFolder, use_filename: false, unique_filename: true })
                            const doctor = new registerMod({
                                profilePicture: upload.secure_url,
                                firstname: Firstname,
                                lastname: Lastname,
                                password: bcrypt.hashSync(Password, 10),
                                gender: Gender,
                                email: Email,
                                profilePublicID: upload.public_id
                            })
                            const saveDoctor = await doctor.save()
                            const random = token.random(4)
                            console.log(random)
                            const auth = new authMod({
                                uniqueID: saveDoctor._id,
                                email: saveDoctor.email,
                                otp: random
                            })
                            await auth.save()
                            sess.email = req.body.email
                            sess.password = req.body.password
                            const mailOption={
                                from: `${process.env.adminName} ${process.env.email}`,
                                to: Email,
                                subject: `${Firstname} ${Lastname} OTP`,
                                html: `
                                    <body>
                                        <center><h3>Hello ${Firstname} ${Lastname} your OTP is...</h3></center>
                                        <center><h1>${random}</h1></center>
                                    </body>
                                `
                            }
                            await systemMail.sendMail(mailOption)
                            res.redirect('/doctorRegister/otp')
                        } else {
                            res.render('doctor/auth/register', { msg: 'Invalid Image File Type'})
                        }
                    }
                } else {
                    res.render('doctor/auth/register', { msg: 'Password and Confirm Password has to be the same' })
                }
            } else {
                res.render('doctor/auth/register', { msg: 'Please fIll all Fields Correctly' })
            }
        } else {
            res.render('doctor/auth/register', { msg: 'Please fill all the fields!' })
        }
    } catch(err) {
        console.log(err)
        res.render('doctor/auth/register', { msg: 'An Error Occured!!!' })
    }
})

router.get('/otp', (req, res) => {
    const sess = req.session
    console.log(sess)
    if (sess.email && sess.password) {
        res.render('doctor/auth/otp', { msg: '' })
    } else {
        res.redirect('/home')
    }
})

router.post('/otp', async(req, res, next) => {
    const sess = req.session
    console.log(sess)
    const one = req.body.a
    const two = req.body.b
    const three = req.body.c
    const four = req.body.d
    const OTP = `${one}${two}${three}${four}`
    if(sess.email && sess.password) {
        try {
            const doctorAuth = await authMod.findOne({ email: sess.email })
            const doctorReg = await registerMod.findOne({ email: sess.email })
            if (doctorAuth && doctorReg) {
                if (OTP != null) {
                    const check = await authMod.findOne({ email: sess.email })
                    if (OTP != check.otp) {
                        res.render('doctor/auth/otp', { msg: 'Incorrect OTP' })
                    } else {
                        authMod.findOneAndUpdate({ email: sess.email }, { verified: true }, (err, docs) => {
                            if (err) {
                                console.log(err)
                                next(err)
                            } else {
                                registerMod.findOneAndUpdate({ email: sess.email }, { verified: true }, (err, docs) => {
                                    if (err) {
                                        console.log(err)
                                        next(err)
                                    } else {
                                        sess.identifier = 'doctor'
                                        console.log(sess)
                                        res.redirect('/doctor')
                                    }
                                })
                            }
                        })
                    }
                } else {
                    res.render('doctor/auth/otp', { msg: 'OTP cannot be Empty' })
                }
            } else {
                sess.destroy()
                res.redirect('/home')
            }
        } catch(err) {
            console.log(err)
            res.render('doctor/auth/otp', { msg: 'An Error Occured!!!'})
        }
    } else {
        res.redirect('/home')
    }
})

module.exports = router