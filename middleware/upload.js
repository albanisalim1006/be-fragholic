const multer = require("multer")
const path = require("path")

//konfigurasi multer buat ngehandle upload file
const storage = multer.diskStorage({
    //menentukan folder buat nyimpen filenya
    destination: function (req, file, cb) {
        //file yang diupload disimpan di folder uploads
        cb(null, path.join(__dirname, '../uploads'))
    },
    //buat nma filenya unik, jdi semisal ngeupload foto yg sama, gabakal ketimpa
    filename: function (req, file, cb) {
        //timestamp + angka rndom biar unikk
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        //ngambil ekstensi asli file (.jpg, .png, dll)
        const ext = path.extname(file.originalname)
        const name = file.fieldname + '-' + uniqueSuffix + ext
        cb(null, name)
    }
})

module.exports = multer({ storage: storage })