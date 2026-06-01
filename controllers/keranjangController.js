const { Keranjang, Produk } = require('../models')
const { response } = require('../helpers/response.formatter')

module.exports = {

    getKeranjang: async (req, res) => {
        try {
            //ambil keranjang milik user yang sedang login
            const keranjang = await Keranjang.findAll({
                where: { user_id: req.user.id },
                include: [{ model: Produk }] //include produk biar tau nama, harga, dll
            })
            return res.status(200).json(response(200, "success", keranjang))
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))
        }
    },

    addKeranjang: async (req, res) => {
        try {
            const { produk_id, jumlah } = req.body
            const user_id = req.user.id

            //cek produknya ada
            const produk = await Produk.findByPk(produk_id)
            if (!produk) {
                return res.status(404).json(response(404, "produk tidak ditemukan"))
            }

            //cek stok cukup
            if (Number(jumlah) > produk.stok) {
                return res.status(400).json(response(400, `stok tidak cukup, tersedia: ${produk.stok}`))
            }

            //kalau produk udah ada di keranjang, tambah jumlahnya aja
            const keranjangAda = await Keranjang.findOne({ where: { user_id, produk_id } })
            if (keranjangAda) {
                await keranjangAda.update({ jumlah: keranjangAda.jumlah + Number(jumlah) })
                return res.status(200).json(response(200, "jumlah produk diupdate", keranjangAda))
            }

            //kalau belum ada, tambah baru
            const keranjang = await Keranjang.create({
                user_id,
                produk_id,
                jumlah: Number(jumlah)
            })
            return res.status(201).json(response(201, "produk ditambahkan ke keranjang", keranjang))
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))
        }
    },

    updateKeranjang: async (req, res) => {
        try {
            const { jumlah } = req.body

            //pastiin keranjang milik user yang login
            const keranjang = await Keranjang.findOne({
                where: { id: req.params.id, user_id: req.user.id }
            })
            if (!keranjang) {
                return res.status(404).json(response(404, "item keranjang tidak ditemukan"))
            }

            //cek stok masih cukup
            const produk = await Produk.findByPk(keranjang.produk_id)
            if (Number(jumlah) > produk.stok) {
                return res.status(400).json(response(400, `stok tidak cukup, tersedia: ${produk.stok}`))
            }

            await keranjang.update({ jumlah: Number(jumlah) })
            return res.status(200).json(response(200, "keranjang berhasil diupdate", keranjang))
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))
        }
    },

    deleteKeranjang: async (req, res) => {
        try {
            const keranjang = await Keranjang.findOne({
                where: { id: req.params.id, user_id: req.user.id }
            })
            if (!keranjang) {
                return res.status(404).json(response(404, "item keranjang tidak ditemukan"))
            }

            await keranjang.destroy()
            return res.status(200).json(response(200, "produk berhasil dihapus dari keranjang"))
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))
        }
    }
}