const express = require('express')
const cors = require('cors')
const swaggerUi = require('swagger-ui-express') // lib swagger-ui
require('dotenv').config()

const swaggerDocument = require('./swagger.json')

const app = express()

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())
app.use('/uploads', express.static('uploads'))

//routing untuk dokumentasi API pake swagger
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
    console.log(`Server jalan di port ${PORT}`)
    console.log(`API Docs ready at: http://localhost:${PORT}/api-docs`)
})