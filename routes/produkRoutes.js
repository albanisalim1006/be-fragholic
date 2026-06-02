const express = require('express')
const router = express.Router()
const produkController = require('../controllers/produkController')
const { checkToken } = require('../middleware/authMiddleware')
const { checkRole } = require('../middleware/roleMiddleware')
const upload = require('../middleware/upload')

//public route
router.get('/', produkController.getProduk)
router.get('/:id', produkController.getProdukById)
router.get('/:id/rekomendasi', produkController.getRekomendasiProduk)

//cuman admin, upload.single berarti cuma 1 file, field namenya 'foto'
router.post('/', checkToken, checkRole('admin'), upload.single('foto'), produkController.createProduk)
router.put('/:id', checkToken, checkRole('admin'), upload.single('foto'), produkController.updateProduk)
router.delete('/:id', checkToken, checkRole('admin'), produkController.deleteProduk)

module.exports = router