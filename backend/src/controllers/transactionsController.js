const { Transaction, TransactionItem } = require('../models')
const { makeCode, computeTotals } = require('../utils/receipt')
const { Op } = require('sequelize')

exports.getAllTransactions = async (req, res) => {
    try {
        const items = await Transaction.findAll({
            where: { deletedAt: null },
            order: [['createdAt', 'DESC']],
            include: [{ model: TransactionItem, as: 'items' }]
        })
        res.json({ data: items })
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

exports.getTransactionById = async (req, res) => {
    try {
        const id = Number(req.params.id)
        const item = await Transaction.findByPk(id, {
            where: { deletedAt: null },
            include: [{ model: TransactionItem, as: 'items' }]
        })
        if (!item) return res.status(404).json({ message: 'Transaksi tidak ditemukan' })
        res.json({ data: item })
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

exports.createTransaction = async (req, res) => {
    const payload = req.body || {}
    const items = Array.isArray(payload.items) ? payload.items : []

    if (!items.length) return res.status(400).json({ message: 'Minimal 1 item.' })

    const normalized = items.map((it) => ({
        name: String(it.name || 'Item').trim(),
        qty: Math.max(1, Number(it.qty || 1)),
        price: Math.max(0, Number(it.price || 0))
    }))

    const totals = computeTotals(normalized, payload.discount, payload.tax, payload.paid)

    if (totals.paid < totals.total) {
        return res.status(400).json({ message: 'Nominal bayar kurang dari total.' })
    }

    const t = await Transaction.sequelize.transaction()
    try {
        const trx = await Transaction.create({
            code: makeCode(),
            patientName: payload.patientName || null,
            unit: payload.unit || null,
            paymentMethod: payload.paymentMethod || 'Cash',
            note: payload.note || null,
            subtotal: totals.subtotal,
            discount: totals.discount,
            tax: totals.tax,
            total: totals.total,
            paid: totals.paid,
            change: totals.change
        }, { transaction: t })

        await TransactionItem.bulkCreate(
            normalized.map((it) => ({
                transactionId: trx.id,
                name: it.name,
                qty: it.qty,
                price: it.price
            })),
            { transaction: t }
        )

        await t.commit()

        const created = await Transaction.findByPk(trx.id, {
            include: [{ model: TransactionItem, as: 'items' }]
        })

        res.status(201).json({ data: created })
    } catch (e) {
        await t.rollback()
        res.status(500).json({ message: e.message })
    }
}

exports.deleteTransaction = async (req, res) => {
    const id = Number(req.params.id)
    try {
        const transaction = await Transaction.findByPk(id)
        if (!transaction) return res.status(404).json({ message: 'Transaksi tidak ditemukan' })

        // Soft delete
        await transaction.update({ deletedAt: new Date() })
        res.json({ ok: true, message: 'Transaksi telah dipindahkan ke trash' })
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

exports.getTrashedTransactions = async (req, res) => {
    try {
        const search = req.query.search || ''
        const items = await Transaction.findAll({
            where: {
                deletedAt: { [Op.ne]: null },
                ...(search && {
                    [Op.or]: [
                        { code: { [Op.like]: `%${search}%` } },
                        { patientName: { [Op.like]: `%${search}%` } }
                    ]
                })
            },
            order: [['deletedAt', 'DESC']],
            include: [{ model: TransactionItem, as: 'items' }]
        })
        res.json({ data: items })
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

exports.restoreTransaction = async (req, res) => {
    const id = Number(req.params.id)
    try {
        const transaction = await Transaction.findByPk(id)
        if (!transaction) return res.status(404).json({ message: 'Transaksi tidak ditemukan' })

        await transaction.update({ deletedAt: null })
        res.json({ ok: true, message: 'Transaksi telah dipulihkan' })
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

exports.permanentlyDeleteTransaction = async (req, res) => {
    const id = Number(req.params.id)
    const t = await Transaction.sequelize.transaction()
    try {
        await TransactionItem.destroy({ where: { transactionId: id }, transaction: t })
        const n = await Transaction.destroy({ where: { id }, transaction: t })
        await t.commit()
        if (!n) return res.status(404).json({ message: 'Transaksi tidak ditemukan' })
        res.json({ ok: true, message: 'Transaksi telah dihapus permanen' })
    } catch (e) {
        await t.rollback()
        res.status(500).json({ message: e.message })
    }
}
