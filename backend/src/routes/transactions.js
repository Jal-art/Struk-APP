const router = require('express').Router()
const {
  getAllTransactions,
  getTransactionById,
  createTransaction,
  deleteTransaction
} = require('../controllers/transactionsController')

router.get('/', getAllTransactions)
router.get('/:id', getTransactionById)
router.post('/', createTransaction)
router.delete('/:id', deleteTransaction)

module.exports = router
