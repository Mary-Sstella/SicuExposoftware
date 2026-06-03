const { Router } = require('express')
const controller = require('../controllers/qr.controller')
const { verifyToken, verifyRole } = require('../middleware/auth.middleware')
const { ROLES } = require('../constants/roles')

const router = Router()

router.get('/:id_reserva', verifyToken, verifyRole(ROLES.ESTUDIANTE), controller.generarQR)
router.post('/escanear', verifyToken, verifyRole(ROLES.ADMIN), controller.escanearQR)

module.exports = router
