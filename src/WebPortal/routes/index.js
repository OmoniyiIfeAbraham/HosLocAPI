const express = require('express')

const router = express.Router()

router.get('/', (req, res) => {
    res.send('Register Your Hospital || Login To An Existing Account')
})

module.exports = router