const express = require('express')
const cors = require('cors')
const swaggerUi = require('swagger-ui-express') // lib swagger-ui
require('dotenv').config()

// 2. Load file swagger.json (Native, tanpa parser tambahan)
const swaggerDocument = require('./swagger.json')

const app = express()

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())
app.use('/uploads', express.static('uploads'))

// 3. Pasang routing untuk dokumentasi Swagger UI bawaan asli
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// Mendaftarkan semua routes utama lu
app.use('/api/auth', require('./routes/authRoutes'))
app.use('/api/produk', require('./routes/produkRoutes'))
app.use('/api/kategori', require('./routes/kategoriRoutes'))
app.use('/api/keranjang', require('./routes/keranjangRoutes'))
app.use('/api/pesanan', require('./routes/pesananRoutes'))
app.use('/api/laporan', require('./routes/laporanRoutes'))

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`\n==================================================`)
    console.log(`🚀 Server jalan di port ${PORT}`)
    console.log(`📄 API Docs ready at: http://localhost:${PORT}/api-docs`)
    console.log(`==================================================\n`)
})