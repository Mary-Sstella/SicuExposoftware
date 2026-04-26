const { Router } = require('express')
const { getSummary, getAsistenciaSemanal, getActividadesRecientes } = require('./dashboard.controller')
const { verifyToken, verifyRole } = require('../auth/auth.middleware')

const router = Router()

router.get('/summary', verifyToken, verifyRole('ADMIN'), getSummary)
router.get('/asistencia-semanal', verifyToken, verifyRole('ADMIN'), getAsistenciaSemanal)
router.get('/actividades-recientes', verifyToken, verifyRole('ADMIN'), getActividadesRecientes)

module.exports = router