const Validator = require("fastest-validator")
const v = new Validator()
const { Kategori } = require('../models')
const { response } = require('../helpers/response.formatter')

module.exports = {

    getKategori: async (req, res) => {
        try {
            const kategori = await Kategori.findAll()
            return res.status(200).json(response(200, "success", kategori))
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))
        }
    },

    getKategoriById: async (req, res) => {
        try {
            const kategori = await Kategori.findByPk(req.params.id)
            if (!kategori) {
                return res.status(404).json(response(404, "kategori tidak ditemukan"))
            }
            return res.status(200).json(response(200, "success", kategori))
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))
        }
    },

    createKategori: async (req, res) => {
        try {
            const { nama_kategori, deskripsi } = req.body

            //validasi input
            const schema = {
                nama_kategori: { type: "string", min: 3 }
            }
            const validate = v.validate({ nama_kategori }, schema)
            if (validate.length > 0) {
                return res.status(400).json(response(400, "validasi error", validate))
            }

            //cek nama kategori sudah ada atau belum
            const cek = await Kategori.findOne({ where: { nama_kategori } })
            if (cek) {
                return res.status(400).json(response(400, "nama kategori sudah ada"))
            }

            const kategori = await Kategori.create({ nama_kategori, deskripsi })
            return res.status(201).json(response(201, "kategori berhasil dibuat", kategori))
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))
        }
    },

    updateKategori: async (req, res) => {
        try {
            const { nama_kategori, deskripsi } = req.body

            const kategori = await Kategori.findByPk(req.params.id)
            if (!kategori) {
                return res.status(404).json(response(404, "kategori tidak ditemukan"))
            }

            await kategori.update({ nama_kategori, deskripsi })
            return res.status(200).json(response(200, "kategori berhasil diupdate", kategori))
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))
        }
    },

    deleteKategori: async (req, res) => {
        try {
            const kategori = await Kategori.findByPk(req.params.id)
            if (!kategori) {
                return res.status(404).json(response(404, "kategori tidak ditemukan"))
            }

            await kategori.destroy()
            return res.status(200).json(response(200, "kategori berhasil dihapus"))
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))
        }
    }
}