const { Router } = require('express')
const controller = require('./asistencia.controller')
const { verifyToken, verifyRole } = require('../../shared/middleware/auth.middleware')
const { ROLES } = require('../../shared/constants/roles')

const router = Router()

router.post('/', verifyToken, verifyRole(ROLES.ADMIN), controller.registrarAsistencia)
router.get('/', verifyToken, verifyRole(ROLES.ADMIN), controller.getAsistenciasPorFecha)

module.exports = router