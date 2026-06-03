const { Router } = require('express')
const controller = require('../controllers/turno.controller')
const { verifyToken, verifyRole } = require('../middleware/auth.middleware')
const { ROLES } = require('../constants/roles')

const router = Router()

router.get('/configuracion', verifyToken, verifyRole(ROLES.ADMIN), controller.getConfiguracionTurnos)
router.put('/configuracion/:id', verifyToken, verifyRole(ROLES.ADMIN), controller.updateConfiguracion)
router.get('/disponibilidad', verifyToken, controller.getDisponibilidad)
router.get('/', verifyToken, verifyRole(ROLES.ADMIN), controller.getTurnosPorFecha)
router.get('/estudiante/:id', verifyToken, controller.getTurnoEstudiante)
router.get('/estudiante/:id/activa', verifyToken, controller.getReservaActiva)
router.post('/estudiante/:id/reservar', verifyToken, verifyRole(ROLES.ESTUDIANTE), controller.crearReserva)
router.get('/estudiante/:id/dias', verifyToken, controller.getDiasEstudiante)
router.get('/estudiante/:id/historial', verifyToken, controller.getHistorialEstudiante)
router.get('/estudiante/:id/fechas-pagadas', verifyToken, controller.getFechasPagadas)
router.get('/estudiante/:id/stats', verifyToken, controller.getEstudianteStats)
router.get('/turnero', controller.getTurneroActual)

module.exports = router