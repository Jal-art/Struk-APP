const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]

        if (!token) {
            return res.status(401).json({ message: 'Token tidak ditemukan' })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
        req.user = decoded
        next()
    } catch (e) {
        if (e.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token telah kadaluarsa' })
        }
        res.status(401).json({ message: 'Token tidak valid' })
    }
}

const adminMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]

        if (!token) {
            return res.status(401).json({ message: 'Token tidak ditemukan' })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')

        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Hanya admin yang dapat mengakses' })
        }

        req.user = decoded
        next()
    } catch (e) {
        if (e.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token telah kadaluarsa' })
        }
        res.status(401).json({ message: 'Token tidak valid' })
    }
}

module.exports = { authMiddleware, adminMiddleware }
