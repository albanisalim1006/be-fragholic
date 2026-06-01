const multer = require("multer")
const path = require("path")

//konfigurasi penyimpanan file yang diupload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        //file yang diupload disimpan di folder uploads
        cb(null, path.join(__dirname, '../uploads'))
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        //ngambil ekstensi asli file (.jpg, .png, dll)
        const ext = path.extname(file.originalname)
        const name = file.fieldname + '-' + uniqueSuffix + ext
        cb(null, name)
    }
})

module.exports = multer({ storage: storage })