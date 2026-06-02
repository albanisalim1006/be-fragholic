const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const { checkToken } = require('../middleware/authMiddleware')

//prefix route didefinisikan di app.js 

//public bisa akses tanpa harus login
router.post('/register', authController.register)
router.post('/login', authController.login)
router.post('/register-admin', authController.registerAdmin) //hapus kalo admin udah dibuat

//harus login dulu baru bisa akses route profile
router.get('/profile', checkToken, authController.getProfile)

module.exports = router