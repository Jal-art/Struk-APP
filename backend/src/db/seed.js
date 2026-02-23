require('dotenv').config()
const bcrypt = require('bcryptjs')
const { sequelize } = require('./index')
const { Transaction, TransactionItem, User } = require('../models')
const { makeCode, computeTotals } = require('../utils/receipt')

async function main() {
  await sequelize.sync({ alter: true })

  // Seed admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  await User.findOrCreate({
    where: { username: 'admin' },
    defaults: {
      username: 'admin',
      email: 'admin@klinik.com',
      password: hashedPassword,
      fullName: 'Administrator',
      role: 'admin',
      isActive: true
    }
  })

  console.log('Admin user created/verified')

  // Seed sample transactions
  const items = [
    { name: 'Konsultasi', qty: 1, price: 100000 },
    { name: 'USG', qty: 1, price: 150000 }
  ]
  const totals = computeTotals(items, 0, 0, 300000)

  const trx = await Transaction.create({
    code: makeCode(),
    patientName: 'Contoh Pasien',
    unit: 'Poli KIA',
    paymentMethod: 'Cash',
    note: 'Terima kasih.',
    ...totals
  })

  await TransactionItem.bulkCreate(items.map(it => ({ transactionId: trx.id, ...it })))

  console.log('Sample transaction inserted:', trx.id)
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
