const Validator = require("fastest-validator")
const v = new Validator()
const { Produk, Kategori } = require('../models')
const { response } = require('../helpers/response.formatter')
const { Op } = require("sequelize")
const path = require('path')
const fs = require('fs')

module.exports = {

    getProduk: async (req, res) => {
        try {
            const { nama, kategori_id, gender, ukuran_ml } = req.query

            // siapkan filter pencarian
            let whereClause = {}

            if (nama) whereClause.nama_produk = { [Op.like]: `%${nama}%` }
            if (kategori_id) whereClause.kategori_id = kategori_id
            if (gender) whereClause.gender = gender
            if (ukuran_ml) whereClause.ukuran_ml = ukuran_ml

            const produk = await Produk.findAll({
                where: whereClause,
                include: [{ model: Kategori }]
            })

            return res.status(200).json(response(200, "success", produk))
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))
        }
    },

    getProdukById: async (req, res) => {
        try {
            const produk = await Produk.findByPk(req.params.id, {
                include: [{ model: Kategori }]
            })

            if (!produk) {
                return res.status(404).json(response(404, "produk tidak ditemukan"))
            }

            return res.status(200).json(response(200, "success", produk))
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))
        }
    },

    createProduk: async (req, res) => {
        try {
            const {
                kategori_id,
                nama_produk,
                deskripsi,
                harga,
                stok,
                merek,
                ukuran_ml,
                gender
            } = req.body

            // validasi data
            const schema = {
                nama_produk: { type: "string", min: 3 },
                harga: { type: "number", positive: true },
                stok: { type: "number", positive: true, integer: true },
                ukuran_ml: { type: "number", positive: true, integer: true }
            }

            const data = {
                nama_produk,
                harga: Number(harga),
                stok: Number(stok),
                ukuran_ml: Number(ukuran_ml)
            }

            const validate = v.validate(data, schema)

            if (validate.length > 0) {
                return res.status(400).json(response(400, "validasi error", validate))
            }

            // cek kategori
            const kategori = await Kategori.findByPk(Number(kategori_id))

            if (!kategori) {
                return res.status(404).json(response(404, "kategori tidak ditemukan"))
            }

            const foto = req.file ? req.file.filename : null

            const produk = await Produk.create({
                kategori_id: Number(kategori_id),
                nama_produk,
                deskripsi,
                harga: Number(harga),
                stok: Number(stok),
                foto,
                merek,
                ukuran_ml: Number(ukuran_ml),
                gender
            })

            return res.status(201).json(
                response(201, "produk berhasil dibuat", produk)
            )

        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))
        }
    },

    updateProduk: async (req, res) => {
        try {
            const {
                kategori_id,
                nama_produk,
                deskripsi,
                harga,
                stok,
                merek,
                ukuran_ml,
                gender
            } = req.body

            const produk = await Produk.findByPk(req.params.id)

            if (!produk) {
                return res.status(404).json(response(404, "produk tidak ditemukan"))
            }

            // ganti foto lama jika ada upload baru
            if (req.file && produk.foto) {
                const fotoLama = path.join(__dirname, '../uploads', produk.foto)

                if (fs.existsSync(fotoLama)) {
                    fs.unlinkSync(fotoLama)
                }
            }

            await produk.update({
                kategori_id: Number(kategori_id),
                nama_produk,
                deskripsi,
                harga: Number(harga),
                stok: Number(stok),
                foto: req.file ? req.file.filename : produk.foto,
                merek,
                ukuran_ml: Number(ukuran_ml),
                gender
            })

            return res.status(200).json(
                response(200, "produk berhasil diupdate", produk)
            )

        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))
        }
    },

    deleteProduk: async (req, res) => {
        try {
            const produk = await Produk.findByPk(req.params.id)

            if (!produk) {
                return res.status(404).json(response(404, "produk tidak ditemukan"))
            }

            // hapus foto produk
            if (produk.foto) {
                const fotoPath = path.join(__dirname, '../uploads', produk.foto)

                if (fs.existsSync(fotoPath)) {
                    fs.unlinkSync(fotoPath)
                }
            }

            await produk.destroy()

            return res.status(200).json(
                response(200, "produk berhasil dihapus")
            )

        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))
        }
    },

    getRekomendasiProduk: async (req, res) => {
        try {
            const produk = await Produk.findByPk(req.params.id)

            if (!produk) {
                return res.status(404).json(response(404, "produk tidak ditemukan"))
            }

            // cari produk serupa
            const rekomendasi = await Produk.findAll({
                where: {
                    kategori_id: produk.kategori_id,
                    gender: produk.gender,
                    id: {
                        [Op.ne]: req.params.id
                    }
                },
                limit: 4,
                include: [{ model: Kategori }]
            })

            return res.status(200).json(
                response(200, "success", rekomendasi)
            )

        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))
        }
    }
}