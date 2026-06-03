const { Pesanan, DetailPesanan, Produk, User } = require('../models')
const { response } = require('../helpers/response.formatter')
const { Op } = require('sequelize')

module.exports = {

    getLaporan: async (req, res) => {
        try {
            const { bulan, tahun } = req.query
            let whereClause = {}

            if (bulan && tahun) {
                const startDate = new Date(tahun, bulan - 1, 1)
                const endDate = new Date(tahun, bulan, 0, 23, 59, 59)
                whereClause.createdAt = { [Op.between]: [startDate, endDate] }
            }

            // ambil data pesanan dari database, untuk ditampilkan di tabel laporan
            const pesanan = await Pesanan.findAll({
                where: whereClause,
                include: [
                    { model: User, attributes: ['nama', 'email'] },
                    { model: DetailPesanan, include: [{ model: Produk, attributes: ['nama_produk'] }] }
                ],
                order: [['createdAt', 'DESC']]
            })

            // hitung total pendapatan dari pesanan yang sudah selesai
            const totalPendapatan = pesanan
                .filter(p => p.status === 'selesai')
                .reduce((acc, p) => acc + Number(p.total_harga), 0)

            return res.status(200).json(response(200, "success", {
                pesanan,
                totalPesanan: pesanan.length,
                totalPendapatan
            }))
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))
        }
    },

    // export ke csv, buat laporan penjualan
    exportExcel: async (req, res) => {
        try {
            const { bulan, tahun } = req.query
            let whereClause = {}

            if (bulan && tahun) {
                const startDate = new Date(tahun, bulan - 1, 1)
                const endDate = new Date(tahun, bulan, 0, 23, 59, 59)
                whereClause.createdAt = { [Op.between]: [startDate, endDate] }
            }

            // ambil data pesanan dari database
            const pesanan = await Pesanan.findAll({
                where: whereClause,
                include: [
                    { model: User, attributes: ['nama', 'email'] },
                    { model: DetailPesanan, include: [{ model: Produk, attributes: ['nama_produk'] }] }
                ],
                order: [['createdAt', 'DESC']]
            })

            const totalPendapatan = pesanan
                .filter(p => p.status === 'selesai')
                .reduce((acc, p) => acc + Number(p.total_harga), 0)

            // buat isi CSV
            // \n = pindah baris, ; = pemisah kolom (lebih aman dari koma untuk Excel Indonesia)
            let csv = ''

            // baris judul
            csv += 'LAPORAN PENJUALAN FRAGHOLIC\n'
            if (bulan && tahun) {
                const periode = new Date(tahun, bulan - 1).toLocaleString('id-ID', { month: 'long', year: 'numeric' })
                csv += `Periode: ${periode}\n`
            }
            csv += '\n'

            // baris ringkasan
            csv += `Total Pesanan;${pesanan.length}\n`
            csv += `Total Pendapatan;Rp ${totalPendapatan.toLocaleString('id-ID')}\n`
            csv += '\n'

            // header tabel
            csv += 'No;ID Pesanan;Nama Customer;Email;Total Harga;Status;Tanggal\n'

            // isi data pesanan, loop satu per satu
            pesanan.forEach((p, i) => {
                const tanggal = new Date(p.createdAt).toLocaleDateString('id-ID')
                const total = `Rp ${Number(p.total_harga).toLocaleString('id-ID')}`

                // setiap kolom dipisah titik koma
                csv += `${i + 1};${p.id};${p.User?.nama || '-'};${p.User?.email || '-'};${total};${p.status};${tanggal}\n`
            })

            // kasih tahu browser bahwa ini file CSV yang harus didownload
            res.setHeader('Content-Type', 'text/csv; charset=utf-8')
            res.setHeader('Content-Disposition', `attachment; filename=laporan-fragholic.csv`)

            // kirim isi CSV langsung sebagai response
            return res.send(csv)

        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))
        }
    }
}