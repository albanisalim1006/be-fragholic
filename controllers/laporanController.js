const { Pesanan, DetailPesanan, Produk, User } = require('../models')
const { response } = require('../helpers/response.formatter')
const PDFDocument = require('pdfkit')
const { Op } = require('sequelize')

module.exports = {

    getLaporan: async (req, res) => {
        try {
            const { bulan, tahun } = req.query
            let whereClause = {}

            //filter berdasarkan bulan dan tahun kalau ada
            if (bulan && tahun) {
                const startDate = new Date(tahun, bulan - 1, 1)
                const endDate = new Date(tahun, bulan, 0, 23, 59, 59)
                whereClause.createdAt = { [Op.between]: [startDate, endDate] }
            }

            const pesanan = await Pesanan.findAll({
                where: whereClause,
                include: [
                    { model: User, attributes: ['nama', 'email'] },
                    { model: DetailPesanan, include: [{ model: Produk, attributes: ['nama_produk'] }] }
                ],
                order: [['createdAt', 'DESC']]
            })

            //hitung total pendapatan dari pesanan yang sudah selesai
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

    exportPDF: async (req, res) => {
        try {
            const { bulan, tahun } = req.query
            let whereClause = {}

            if (bulan && tahun) {
                const startDate = new Date(tahun, bulan - 1, 1)
                const endDate = new Date(tahun, bulan, 0, 23, 59, 59)
                whereClause.createdAt = { [Op.between]: [startDate, endDate] }
            }

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

            //buat dokumen PDF baru
            const doc = new PDFDocument({ margin: 50, size: 'A4' })

            //set header response biar browser tau ini file PDF
            res.setHeader('Content-Type', 'application/pdf')
            res.setHeader('Content-Disposition', `attachment; filename=laporan-fragholic.pdf`)

            //streaming PDF langsung ke response
            doc.pipe(res)

            //isi PDF
            doc.fontSize(22).font('Helvetica-Bold').text('FRAGHOLIC', { align: 'center' })
            doc.fontSize(12).font('Helvetica').text('Laporan Penjualan', { align: 'center' })

            if (bulan && tahun) {
                const periode = new Date(tahun, bulan - 1).toLocaleString('id-ID', { month: 'long', year: 'numeric' })
                doc.text(`Periode: ${periode}`, { align: 'center' })
            }

            doc.moveDown()
            doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke()
            doc.moveDown()

            doc.fontSize(13).font('Helvetica-Bold').text('Ringkasan')
            doc.moveDown(0.4)
            doc.fontSize(11).font('Helvetica')
            doc.text(`Total Pesanan    : ${pesanan.length}`)
            doc.text(`Total Pendapatan : Rp ${totalPendapatan.toLocaleString('id-ID')}`)
            doc.moveDown()
            doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke()
            doc.moveDown()

            //header tabel
            doc.fontSize(10).font('Helvetica-Bold')
            const yHeader = doc.y
            doc.text('No',       50,  yHeader, { width: 30 })
            doc.text('Customer', 85,  yHeader, { width: 130 })
            doc.text('Total',    220, yHeader, { width: 110 })
            doc.text('Status',   335, yHeader, { width: 80 })
            doc.text('Tanggal',  420, yHeader, { width: 110 })
            doc.moveDown(0.4)
            doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke()
            doc.moveDown(0.3)

            //isi tabel
            doc.font('Helvetica').fontSize(10)
            pesanan.forEach((p, i) => {
                if (doc.y > 700) { doc.addPage(); doc.y = 50 }
                const y = doc.y
                doc.text(`${i + 1}`,   50,  y, { width: 30 })
                doc.text(p.User?.nama || '-', 85, y, { width: 130 })
                doc.text(`Rp ${Number(p.total_harga).toLocaleString('id-ID')}`, 220, y, { width: 110 })
                doc.text(p.status,     335, y, { width: 80 })
                doc.text(new Date(p.createdAt).toLocaleDateString('id-ID'), 420, y, { width: 110 })
                doc.moveDown(0.9)
            })

            doc.moveDown()
            doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke()
            doc.moveDown(0.5)
            doc.fontSize(9).fillColor('#999').text(`Dicetak: ${new Date().toLocaleString('id-ID')}`, { align: 'right' })

            doc.end()
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))
        }
    }
}