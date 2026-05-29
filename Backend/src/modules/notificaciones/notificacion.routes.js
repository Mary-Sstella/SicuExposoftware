const { Router } = require('express')
const controller = require('./notificacion.controller')
const { verifyToken, verifyRole } = require('../../shared/middleware/auth.middleware')
const { ROLES } = require('../../shared/constants/roles')

const router = Router()

router.use(verifyToken, verifyRole(ROLES.ESTUDIANTE))

router.get('/', controller.getNotificaciones)
router.patch('/leer-todas', controller.marcarTodasLeidas)
router.patch('/:id_notificacion/leer', controller.marcarLeida)

module.exports = router
