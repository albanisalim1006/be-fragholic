const express = require('express')
const router = express.Router()
const keranjangController = require('../controllers/keranjangController')
const { checkToken } = require('../middleware/authMiddleware')

//semua route keranjang wajib login
router.get('/', checkToken, keranjangController.getKeranjang)
router.post('/', checkToken, keranjangController.addKeranjang)
router.put('/:id', checkToken, keranjangController.updateKeranjang)
router.delete('/:id', checkToken, keranjangController.deleteKeranjang)

module.exports = router