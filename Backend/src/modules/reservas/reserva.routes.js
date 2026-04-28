const { Router } = require('express')
const controller = require('./reserva.controller')
const { verifyToken, verifyRole } = require('../auth/auth.middleware')
const { ROLES } = require('../../shared/constants/roles')

const router = Router()

router.post('/', verifyToken, verifyRole(ROLES.ADMIN), controller.createReserva)
router.get('/asistencia-hoy', verifyToken, verifyRole(ROLES.ADMIN), controller.getAsistenciaHoy)

module.exports = router