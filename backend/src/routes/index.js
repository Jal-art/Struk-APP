const router = require('express').Router()
const auth = require('./auth')
const transactions = require('./transactions')
const external = require('./external')

router.use('/auth', auth)
router.use('/transactions', transactions)
router.use('/external', external)

module.exports = router
