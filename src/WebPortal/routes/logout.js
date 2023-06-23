const express = require('express')
const router = express.Router()

router.get('/super-admin', (req, res) => {
    const sess = req.session
    if (sess.email && sess.password && sess.identifier === 'admin') {
        sess.destroy()
        res.redirect('/')
    } else {
        res.redirect('/super-adminLogin')
    }
})

router.get('/hospital', (req, res) => {
    const sess = req.session
    if (sess.email && sess.password && sess.identifier === 'hospital') {
        sess.destroy()
        res.redirect('/')
    } else {
        res.redirect('/hospitalLogin')
    }
})

module.exports = router