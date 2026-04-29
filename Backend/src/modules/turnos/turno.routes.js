const { Router } = require('express')
const controller = require('./turno.controller')
const { verifyToken, verifyRole } = require('../../shared/middleware/auth.middleware')
const { ROLES } = require('../../shared/constants/roles')

const router = Router()

router.get('/configuracion', verifyToken, verifyRole(ROLES.ADMIN), controller.getConfiguracionTurnos)
router.get('/disponibilidad', verifyToken, controller.getDisponibilidad)
router.get('/', verifyToken, verifyRole(ROLES.ADMIN), controller.getTurnosPorFecha)
router.get('/estudiante/:id', verifyToken, controller.getTurnoEstudiante)

module.exports = router