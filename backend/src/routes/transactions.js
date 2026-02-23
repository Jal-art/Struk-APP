const router = require('express').Router()
const { authMiddleware } = require('../middlewares/auth')
const {
  getAllTransactions,
  getTransactionById,
  createTransaction,
  deleteTransaction,
  getTrashedTransactions,
  restoreTransaction,
  permanentlyDeleteTransaction
} = require('../controllers/transactionsController')

router.get('/', authMiddleware, getAllTransactions)
router.get('/trash/list', authMiddleware, getTrashedTransactions)
router.post('/', authMiddleware, createTransaction)
router.get('/:id', authMiddleware, getTransactionById)
router.delete('/:id', authMiddleware, deleteTransaction)
router.patch('/:id/restore', authMiddleware, restoreTransaction)
router.delete('/:id/permanent', authMiddleware, permanentlyDeleteTransaction)

module.exports = router
