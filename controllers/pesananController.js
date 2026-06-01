const { Pesanan, DetailPesanan, Produk, Keranjang, User } = require('../models')
const { response } = require('../helpers/response.formatter')
const { sequelize } = require('../models')

module.exports = {

    getAllPesanan: async (req, res) => {
        try {
            // ambil data pesanan
            const pesanan = await Pesanan.findAll({
                include: [
                    { model: User, attributes: ['id', 'nama', 'email', 'no_hp'] },
                    { model: DetailPesanan, include: [{ model: Produk }] }
                ],
                order: [['createdAt', 'DESC']] // data terbaru di atas
            })

            return res.status(200).json(response(200, "success", pesanan))
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))
        }
    },

    getMyPesanan: async (req, res) => {
        try {
            // ambil pesanan user yang sedang login
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
            // cek pesanan
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
        // gunakan transaction
        const t = await sequelize.transaction()

        try {
            const { alamat_kirim } = req.body
            const user_id = req.user.id
            const bukti_bayar = req.file ? req.file.filename : null

            // cek bukti pembayaran
            if (!bukti_bayar) {
                await t.rollback()
                return res.status(400).json(response(400, "bukti pembayaran wajib diupload"))
            }

            // ambil isi keranjang
            const keranjang = await Keranjang.findAll({
                where: { user_id },
                include: [{ model: Produk }]
            })

            if (keranjang.length === 0) {
                await t.rollback()
                return res.status(400).json(response(400, "keranjang kosong"))
            }

            // hitung total belanja
            let total_harga = 0
            for (const item of keranjang) {
                total_harga += item.jumlah * item.Produk.harga
            }

            // simpan data pesanan
            const pesanan = await Pesanan.create({
                user_id,
                total_harga,
                status: 'pending',
                alamat_kirim,
                bukti_bayar
            }, { transaction: t })

            // simpan detail pesanan dan update stok
            for (const item of keranjang) {

                // pastikan stok masih tersedia
                if (item.jumlah > item.Produk.stok) {
                    await t.rollback()
                    return res.status(400).json(
                        response(400, `stok ${item.Produk.nama_produk} tidak cukup`)
                    )
                }

                // simpan detail produk yang dibeli
                await DetailPesanan.create({
                    pesanan_id: pesanan.id,
                    produk_id: item.produk_id,
                    jumlah: item.jumlah,
                    harga_satuan: item.Produk.harga,
                    subtotal: item.jumlah * item.Produk.harga
                }, { transaction: t })

                // update stok produk
                await Produk.update(
                    { stok: item.Produk.stok - item.jumlah },
                    { where: { id: item.produk_id }, transaction: t }
                )
            }

            // kosongkan keranjang setelah checkout
            await Keranjang.destroy({
                where: { user_id },
                transaction: t
            })

            // simpan semua perubahan
            await t.commit()

            return res.status(201).json(
                response(201, "pesanan berhasil dibuat", pesanan)
            )

        } catch (error) {
            // batalkan perubahan jika error
            await t.rollback()

            return res.status(500).json(
                response(500, "Server Error", error.message)
            )
        }
    },

    updateStatusPesanan: async (req, res) => {
        try {
            const { status, nama_ekspedisi, nomor_resi } = req.body

            // cek pesanan
            const pesanan = await Pesanan.findByPk(req.params.id)

            if (!pesanan) {
                return res.status(404).json(response(404, "pesanan tidak ditemukan"))
            }

            await pesanan.update({
                status,
                nama_ekspedisi,
                nomor_resi
            })

            return res.status(200).json(
                response(200, "status pesanan berhasil diupdate", pesanan)
            )

        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))
        }
    },

    konfirmasiDiterima: async (req, res) => {
        try {
            // pastikan pesanan milik user
            const pesanan = await Pesanan.findOne({
                where: {
                    id: req.params.id,
                    user_id: req.user.id
                }
            })

            if (!pesanan) {
                return res.status(404).json(response(404, "pesanan tidak ditemukan"))
            }

            // hanya bisa dikonfirmasi setelah dikirim
            if (pesanan.status !== 'dikirim') {
                return res.status(400).json(response(400, "pesanan belum dikirim"))
            }

            await pesanan.update({ status: 'selesai' })

            return res.status(200).json(
                response(200, "pesanan dikonfirmasi selesai", pesanan)
            )

        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))
        }
    }
}