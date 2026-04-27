const { Router } = require('express')
const controller = require('./asistencia.controller')
const { verifyToken, verifyRole } = require('../auth/auth.middleware')

const router = Router()

router.post('/', verifyToken, verifyRole('ADMIN'), controller.registrarAsistencia)
router.get('/', verifyToken, verifyRole('ADMIN'), controller.getAsistenciasPorFecha)

module.exports = router