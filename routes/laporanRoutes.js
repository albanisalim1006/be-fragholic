const express = require('express')
const router = express.Router()
const laporanController = require('../controllers/laporanController')
const { checkToken } = require('../middleware/authMiddleware')
const { checkRole } = require('../middleware/roleMiddleware')

//semua laporan cuman bisa diakses admin
router.get('/', checkToken, checkRole('admin'), laporanController.getLaporan)
router.get('/export-pdf', checkToken, checkRole('admin'), laporanController.exportPDF)

module.exports = router