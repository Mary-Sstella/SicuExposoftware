const { Router } = require('express')
const controller = require('./reserva.controller')
const { verifyToken, verifyRole } = require('../auth/auth.middleware')

const router = Router()

router.post('/', verifyToken, verifyRole('ADMIN'), controller.createReserva)
router.get('/asistencia-hoy', verifyToken, verifyRole('ADMIN'), controller.getAsistenciaHoy)

module.exports = router