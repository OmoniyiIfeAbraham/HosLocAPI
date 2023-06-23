const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')

const registerMod = require('./../../models/HospitalSide/Register')

router.get('/', (req, res) => {
    res.render('HospitalSide/login', { msg: '' })
})

router.post('/', async(req, res) => {
    const sess = req.session
    const loginEmail = req.body.email
    const loginPassword = req.body.password
    // console.log(loginEmail) needed
    // console.log(loginPassword) needed
    try {
        if (loginPassword.length >= 6) {
            const check = await registerMod.findOne({ email: loginEmail })
            if (check) {
                const comparePass = bcrypt.compareSync(loginPassword, check.password)
                if (comparePass == true) {
                    if (check.verified == true) {
                        sess.email = loginEmail,
                        sess.password = loginPassword,
                        sess.identifier = 'hospital'
                        console.log(sess)
                        res.redirect('/hospital')
                    } else {
                        sess.email = loginEmail
                        sess.password = loginPassword
                        res.redirect('/hospitalRegister/otp')
                    }
                } else {
                    res.render('HospitalSide/login', { msg: 'Incorrect Password' })
                }
            } else {
                res.render('HospitalSide/login', { msg: 'Incorrect Email' })
            }
        } else {
            res.render('HospitalSide/login', { msg: 'Password must be 6 or more characters' })
        }
    } catch (err) {
        console.log(err)
        res.render('HospitalSide/login', { msg: 'An Error Occured!!!'})
    }
})

module.exports = router