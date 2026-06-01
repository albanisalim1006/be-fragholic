const { Pesanan, DetailPesanan, Produk, Keranjang, User } = require('../models')
const { response } = require('../helpers/response.formatter')
const { sequelize } = require('../models')

module.exports = {

    getAllPesanan: async (req, res) => {
        try {
            //ambil semua pesanan beserta data user dan detail produknya
            const pesanan = await Pesanan.findAll({
                include: [
                    { model: User, attributes: ['id', 'nama', 'email', 'no_hp'] },
                    { model: DetailPesanan, include: [{ model: Produk }] }
                ],
                order: [['createdAt', 'DESC']] //urut dari yang terbaru
            })
            return res.status(200).json(response(200, "success", pesanan))
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))
        }
    },

    getMyPesanan: async (req, res) => {
        try {
            //ambil pesanan milik user yang login saja
            const pesanan = await Pesanan.findAll({
                where: { user_id: req.user.id },
                include: [{ model: DetailPesanan, include: [{ model: Produk }] }],
                order: [['createdAt', 'DESC']]
            })
            return res.status(200).json(response(200, "success", pesanan))
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))
        }
    },

    getPesananById: async (req, res) => {
        try {
            const pesanan = await Pesanan.findByPk(req.params.id, {
                include: [
                    { model: User, attributes: ['id', 'nama', 'email', 'no_hp'] },
                    { model: DetailPesanan, include: [{ model: Produk }] }
                ]
            })
            if (!pesanan) {
                return res.status(404).json(response(404, "pesanan tidak ditemukan"))
            }
            return res.status(200).json(response(200, "success", pesanan))
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))
        }
    },

    checkout: async (req, res) => {
        //menggunakan database transaction
        //kalau salah satu proses gagal, semua proses dibatalkan (rollback)
        const t = await sequelize.transaction()
        try {
            const { alamat_kirim } = req.body
            const user_id = req.user.id
            const bukti_bayar = req.file ? req.file.filename : null

            if (!bukti_bayar) {
                await t.rollback()
                return res.status(400).json(response(400, "bukti pembayaran wajib diupload"))
            }

            //ambil semua item keranjang milik user
            const keranjang = await Keranjang.findAll({
                where: { user_id },
                include: [{ model: Produk }]
            })

            if (keranjang.length === 0) {
                await t.rollback()
                return res.status(400).json(response(400, "keranjang kosong"))
            }

            //hitung total harga dari semua item di keranjang
            let total_harga = 0
            for (const item of keranjang) {
                total_harga += item.jumlah * item.Produk.harga
            }

            //1. insert data ke tabel Pesanan
            const pesanan = await Pesanan.create({
                user_id,
                total_harga,
                status: 'pending',
                alamat_kirim,
                bukti_bayar
            }, { transaction: t })

            //2. loop keranjang: insert detail pesanan dan kurangi stok
            for (const item of keranjang) {
                //cek stok masih cukup
                if (item.jumlah > item.Produk.stok) {
                    await t.rollback()
                    return res.status(400).json(response(400, `stok ${item.Produk.nama_produk} tidak cukup`))
                }

                //insert ke tabel DetailPesanan
                await DetailPesanan.create({
                    pesanan_id: pesanan.id,
                    produk_id: item.produk_id,
                    jumlah: item.jumlah,
                    harga_satuan: item.Produk.harga,
                    subtotal: item.jumlah * item.Produk.harga
                }, { transaction: t })

                //kurangi stok produk
                await Produk.update(
                    { stok: item.Produk.stok - item.jumlah },
                    { where: { id: item.produk_id }, transaction: t }
                )
            }

            //3. hapus semua item keranjang setelah checkout berhasil
            await Keranjang.destroy({
                where: { user_id },
                transaction: t
            })

            //semua berhasil, commit transaction
            await t.commit()
            return res.status(201).json(response(201, "pesanan berhasil dibuat", pesanan))
        } catch (error) {
            //ada yang gagal, batalkan semua proses
            await t.rollback()
            return res.status(500).json(response(500, "Server Error", error.message))
        }
    },

    updateStatusPesanan: async (req, res) => {
        try {
            const { status, nama_ekspedisi, nomor_resi } = req.body

            const pesanan = await Pesanan.findByPk(req.params.id)
            if (!pesanan) {
                return res.status(404).json(response(404, "pesanan tidak ditemukan"))
            }

            await pesanan.update({ status, nama_ekspedisi, nomor_resi })
            return res.status(200).json(response(200, "status pesanan berhasil diupdate", pesanan))
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))
        }
    },

    konfirmasiDiterima: async (req, res) => {
        try {
            //pastiin pesanan milik user yang login
            const pesanan = await Pesanan.findOne({
                where: { id: req.params.id, user_id: req.user.id }
            })
            if (!pesanan) {
                return res.status(404).json(response(404, "pesanan tidak ditemukan"))
            }

            //hanya bisa konfirmasi kalau statusnya sudah dikirim
            if (pesanan.status !== 'dikirim') {
                return res.status(400).json(response(400, "pesanan belum dikirim"))
            }

            await pesanan.update({ status: 'selesai' })
            return res.status(200).json(response(200, "pesanan dikonfirmasi selesai", pesanan))
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))
        }
    }
}