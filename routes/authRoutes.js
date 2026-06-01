const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const { checkToken } = require('../middleware/authMiddleware')

//prefix route didefinisikan di app.js 
router.post('/register', authController.register)
router.post('/login', authController.login)
router.post('/register-admin', authController.registerAdmin) //hapus kalo admin udah dibuat
router.get('/profile', checkToken, authController.getProfile)

module.exports = router