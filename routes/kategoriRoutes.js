const express = require('express')
const router = express.Router()
const kategoriController = require('../controllers/kategoriController')
const { checkToken } = require('../middleware/authMiddleware')
const { checkRole } = require('../middleware/roleMiddleware')

//get bisa diakses semua orang (public)
router.get('/', kategoriController.getKategori)
router.get('/:id', kategoriController.getKategoriById)

//create, update, delete cuman admin
//token dulu baru checkrole
router.post('/', checkToken, checkRole('admin'), kategoriController.createKategori)
router.put('/:id', checkToken, checkRole('admin'), kategoriController.updateKategori)
router.delete('/:id', checkToken, checkRole('admin'), kategoriController.deleteKategori)

module.exports = router