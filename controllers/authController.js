const Validator = require("fastest-validator")
const v = new Validator()
const { User } = require('../models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { response } = require('../helpers/response.formatter')

module.exports = {

    register: async (req, res) => {
        try {
            const { nama, email, password, no_hp, alamat } = req.body

            //validasi input
            const schema = {
                nama: { type: "string", min: 3 },
                email: { type: "email" },
                password: { type: "string", min: 6 },
                no_hp: { type: "string", min: 10 },
                alamat: { type: "string", min: 5 }
            }
            const validate = v.validate({ nama, email, password, no_hp, alamat }, schema)
            if (validate.length > 0) {
                return res.status(400).json(response(400, "validasi error", validate))
            }

            //cek email sudah dipakai atau belum
            const cekEmail = await User.findOne({ where: { email } })
            if (cekEmail) {
                return res.status(400).json(response(400, "email sudah digunakan"))
            }

            //hash password sebelum disimpan
            const hashedPassword = await bcrypt.hash(password, 10)

            const user = await User.create({
                nama,
                email,
                password: hashedPassword,
                role: 'customer', //register selalu jadi customer
                no_hp,
                alamat
            })

            return res.status(201).json(response(201, "register berhasil", {
                id: user.id,
                nama: user.nama,
                email: user.email,
                role: user.role
            }))
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body

            //cek email ada di database
            const user = await User.findOne({ where: { email } })
            if (!user) {
                return res.status(400).json(response(400, "email atau password salah"))
            }

            //bandingin password input sama yang di database
            const validPass = await bcrypt.compare(password, user.password)
            if (!validPass) {
                return res.status(400).json(response(400, "email atau password salah"))
            }

            //buat token JWT, expired 1 hari
            //payload berisi data user yang disimpan di dalam token
            const token = jwt.sign(
                { id: user.id, nama: user.nama, email: user.email, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            )

            return res.status(200).json(response(200, "login berhasil", {
                token,
                user: {
                    id: user.id,
                    nama: user.nama,
                    email: user.email,
                    role: user.role
                }
            }))
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))
        }
    },

    registerAdmin: async (req, res) => {
        try {
            const { nama, email, password, no_hp, alamat } = req.body

            const cekEmail = await User.findOne({ where: { email } })
            if (cekEmail) {
                return res.status(400).json(response(400, "email sudah digunakan"))
            }

            const hashedPassword = await bcrypt.hash(password, 10)
            const user = await User.create({
                nama, email,
                password: hashedPassword,
                role: 'admin',
                no_hp, alamat
            })

            return res.status(201).json(response(201, "register admin berhasil", {
                id: user.id,
                nama: user.nama,
                email: user.email,
                role: user.role
            }))
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))
        }
    },

    getProfile: async (req, res) => {
        try {
            //req.user diisi dari authMiddleware, ambil berdasarkan id dari token
            const user = await User.findByPk(req.user.id, {
                attributes: { exclude: ['password'] } //jangan tampilkan password
            })
            return res.status(200).json(response(200, "success", user))
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))
        }
    }
}