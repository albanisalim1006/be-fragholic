const express = require('express')
const router = express.Router()
const laporanController = require('../controllers/laporanController')
const { checkToken } = require('../middleware/authMiddleware')
const { checkRole } = require('../middleware/roleMiddleware')

router.get('/', checkToken, checkRole('admin'), laporanController.getLaporan)
// export excel
router.get('/export-excel', checkToken, checkRole('admin'), laporanController.exportExcel)

module.exports = router