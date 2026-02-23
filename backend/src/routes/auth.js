const router = require('express').Router()
const { login, profile, logout } = require('../controllers/authController')
const { authMiddleware } = require('../middlewares/auth')

router.post('/login', login)
router.post('/logout', authMiddleware, logout)
router.get('/profile', authMiddleware, profile)

module.exports = router
