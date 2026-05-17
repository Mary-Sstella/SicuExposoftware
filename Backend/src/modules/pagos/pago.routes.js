const { Router } = require('express');
const controller = require('./pago.controller');
const { verifyToken, verifyRole } = require('../../shared/middleware/auth.middleware');
const { uploadPago } = require('../../shared/middleware/upload.middleware');
const { ROLES } = require('../../shared/constants/roles');

const router = Router();

router.post('/', verifyToken, verifyRole(ROLES.ESTUDIANTE), uploadPago, controller.createPago);
router.get('/', verifyToken, verifyRole(ROLES.ADMIN), controller.getPagos);
router.get('/mis-pagos', verifyToken, verifyRole(ROLES.ESTUDIANTE), controller.getMisPagos);
router.patch('/:id/estado', verifyToken, verifyRole(ROLES.ADMIN), controller.updateEstadoPago);

module.exports = router;
