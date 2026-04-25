const { Router } = require('express')
const { getSummary } = require('./dashboard.controller')
const { verifyToken, verifyRole } = require('../auth/auth.middleware')

const router = Router()

router.get('/summary', verifyToken, verifyRole('ADMIN'), getSummary)

module.exports = router