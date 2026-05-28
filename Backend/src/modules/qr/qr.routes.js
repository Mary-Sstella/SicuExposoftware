const { Router } = require('express')
const controller = require('./qr.controller')
const { verifyToken, verifyRole } = require('../../shared/middleware/auth.middleware')
const { ROLES } = require('../../shared/constants/roles')

const router = Router()

router.get('/:id_reserva', verifyToken, verifyRole(ROLES.ESTUDIANTE), controller.generarQR)
router.post('/escanear', verifyToken, verifyRole(ROLES.ADMIN), controller.escanearQR)

module.exports = router
