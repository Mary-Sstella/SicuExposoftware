const { Router } = require('express')
const controller = require('./turno.controller')
const { verifyToken, verifyRole } = require('../auth/auth.middleware')

const router = Router()

router.post('/asignar', verifyToken, verifyRole('ADMIN'), controller.asignarTurnos)
router.get('/', verifyToken, verifyRole('ADMIN'), controller.getTurnosPorFecha)
router.get('/estudiante/:id', verifyToken, controller.getTurnoEstudiante)

module.exports = router