const { Router } = require('express')
const { getSummary, getAsistenciaSemanal, getActividadesRecientes } = require('./dashboard.controller')
const { verifyToken, verifyRole } = require('../../shared/middleware/auth.middleware')
const { ROLES } = require('../../shared/constants/roles')

const router = Router()

router.get('/summary', verifyToken, verifyRole(ROLES.ADMIN), getSummary)
router.get('/asistencia-semanal', verifyToken, verifyRole(ROLES.ADMIN), getAsistenciaSemanal)
router.get('/actividades-recientes', verifyToken, verifyRole(ROLES.ADMIN), getActividadesRecientes)

module.exports = router