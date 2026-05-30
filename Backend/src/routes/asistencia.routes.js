const { Router } = require('express')
const controller = require('../controllers/asistencia.controller')
const { verifyToken, verifyRole } = require('../middleware/auth.middleware')
const { ROLES } = require('../constants/roles')

const router = Router()

router.post('/', verifyToken, verifyRole(ROLES.ADMIN), controller.registrarAsistencia)
router.get('/', verifyToken, verifyRole(ROLES.ADMIN), controller.getAsistenciasPorFecha)

module.exports = router