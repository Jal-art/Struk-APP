const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { User } = require('../models')

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body

        if (!username || !password) {
            return res.status(400).json({ message: 'Username dan password harus diisi' })
        }

        const user = await User.findOne({ where: { username } })
        if (!user) {
            return res.status(401).json({ message: 'Username atau password salah' })
        }

        if (!user.isActive) {
            return res.status(401).json({ message: 'Akun tidak aktif' })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Username atau password salah' })
        }

        const token = jwt.sign(
            {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                fullName: user.fullName
            },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        )

        res.json({
            message: 'Login berhasil',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                role: user.role
            }
        })
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

exports.profile = async (req, res) => {
    try {
        const userId = req.user.id
        const user = await User.findByPk(userId, {
            attributes: { exclude: ['password'] }
        })

        if (!user) {
            return res.status(404).json({ message: 'User tidak ditemukan' })
        }

        res.json({ data: user })
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

exports.logout = async (req, res) => {
    // Token JWT tidak bisa di-revoke di server side tanpa blacklist
    // Cukup client yang hapus tokennya dari localStorage
    res.json({ message: 'Logout berhasil' })
}
