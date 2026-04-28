const { Router } = require('express')
const controller = require('./turno.controller')
const { verifyToken, verifyRole } = require('../auth/auth.middleware')
const { ROLES } = require('../../shared/constants/roles')

const router = Router()

router.post('/asignar', verifyToken, verifyRole(ROLES.ADMIN), controller.asignarTurnos)
router.get('/', verifyToken, verifyRole(ROLES.ADMIN), controller.getTurnosPorFecha)
router.get('/estudiante/:id', verifyToken, controller.getTurnoEstudiante)

module.exports = router