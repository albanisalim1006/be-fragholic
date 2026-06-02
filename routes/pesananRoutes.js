const express = require('express')
const router = express.Router()
const pesananController = require('../controllers/pesananController')
const { checkToken } = require('../middleware/authMiddleware')
const { checkRole } = require('../middleware/roleMiddleware')
const upload = require('../middleware/upload')

//route customer
router.get('/my', checkToken, pesananController.getMyPesanan)
router.post('/checkout', checkToken, upload.single('bukti_bayar'), pesananController.checkout)
router.put('/:id/konfirmasi', checkToken, pesananController.konfirmasiDiterima)

//route admin, biar aman pake checktoken, baru checkrole
router.get('/', checkToken, checkRole('admin'), pesananController.getAllPesanan)
router.get('/:id', checkToken, checkRole('admin'), pesananController.getPesananById)
router.put('/:id/status', checkToken, checkRole('admin'), pesananController.updateStatusPesanan)

module.exports = router