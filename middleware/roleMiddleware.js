const { response } = require('../helpers/response.formatter')

module.exports = {
    //checkRole dipanggil dengan parameter role yang diizinkan
    //contoh: checkRole('admin') atau checkRole('customer')
    checkRole: (role) => {
        return (req, res, next) => {
            //cek role user yang login sama ga sama role yang dibutuhkan
            if (req.user.role !== role) {
                //403 : forbidden, ga punya akses
                return res.status(403).json(response(403, "forbidden", "anda tidak punya akses!"))
            }
            next()
        }
    }
}