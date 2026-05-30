const { Router } = require('express');
const controller = require('../controllers/pago.controller');
const { verifyToken, verifyRole } = require('../middleware/auth.middleware');
const { uploadPago } = require('../middleware/upload.middleware');
const { ROLES } = require('../constants/roles');

const router = Router();

router.post('/', verifyToken, verifyRole(ROLES.ESTUDIANTE), uploadPago, controller.createPago);
router.get('/', verifyToken, verifyRole(ROLES.ADMIN), controller.getPagos);
router.get('/mis-pagos', verifyToken, verifyRole(ROLES.ESTUDIANTE), controller.getMisPagos);
router.patch('/:id/estado', verifyToken, verifyRole(ROLES.ADMIN), controller.updateEstadoPago);
router.get('/:id/pdf', verifyToken, controller.getPdfUrl);


module.exports = router;
