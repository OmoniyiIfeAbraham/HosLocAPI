const express = require('express')
const router = express.Router()

// const profileMod = require('./../../../models/doctor/profile/profile')

router.get('/', async(req, res) => {
    const sess = req.session
    if (sess.email && sess.password && sess.identifier === 'admin') {
        // const doctors = await profileMod.find()
        // console.log(doctors)
        // res.render('admin/doctors/doctors', { doctors, msg: '' })
        res.render('SuperAdminSide/Hospitals/hospitals')
    } else {
        res.redirect('/super-adminLogin')
    }
})

module.exports = router