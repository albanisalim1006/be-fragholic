const jwt = require('jsonwebtoken')
const { response } = require('../helpers/response.formatter')

module.exports = {
    //parameter untuk melanjutkan request ke controller
    checkToken: async (req, res, next) => {
        //token diambil dari header atau query (buat download file)
        const token = req.header("Authorization")?.replace("Bearer ", "") || req.query.token
        if (!token) {
            //401 : unauthorized, belum login
            return res.status(401).json(response(401, "unauthorized", "please login and try again!"))
        }
        try {
            //cek token masih valid atau udah expired
            const check = jwt.verify(token, process.env.JWT_SECRET)
            //simpan data user dari token ke req.user biar bisa dipakai di controller
            req.user = check
            next()
        } catch (error) {
            return res.status(401).json(response(401, "unauthorized", "token invalid or expired"))
        }
    }
}