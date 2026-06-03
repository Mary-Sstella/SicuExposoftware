const { Router } = require('express')
const controller = require('../controllers/reserva.controller')
const { verifyToken, verifyRole } = require('../middleware/auth.middleware')
const { ROLES } = require('../constants/roles')

const router = Router()

router.post('/', verifyToken, verifyRole(ROLES.ADMIN), controller.createReserva)
router.get('/asistencia-hoy', verifyToken, verifyRole(ROLES.ADMIN), controller.getAsistenciaHoy)

module.exports = router