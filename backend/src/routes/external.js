const router = require('express').Router()
const { pingExternal } = require('../controllers/externalController')

/**
 * Contoh endpoint yang pakai axios di backend
 * GET /api/external/ping => fetch ke EXTERNAL_PING_URL (default httpbin)
 */
router.get('/ping', pingExternal)

module.exports = router
