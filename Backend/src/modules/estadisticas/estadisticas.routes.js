const { Router } = require('express')
const controller = require('./estadisticas.controller')
const { verifyToken, verifyRole } = require('../../shared/middleware/auth.middleware')
const { ROLES } = require('../../shared/constants/roles')

const router = Router()

router.get('/carreras', verifyToken, verifyRole(ROLES.ADMIN), controller.getEstudiantesPorCarrera)
router.get('/asistencia-mensual', verifyToken, verifyRole(ROLES.ADMIN), controller.getAsistenciaMensual)
router.get('/rangos-populares', verifyToken, verifyRole(ROLES.ADMIN), controller.getRangosPopulares)
router.get('/exportar', verifyToken, verifyRole(ROLES.ADMIN), controller.exportarEstadisticas)

module.exports = router