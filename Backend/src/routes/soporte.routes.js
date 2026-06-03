const { Router } = require('express');
const controller = require('../controllers/soporte.controller');
const { verifyToken, verifyRole } = require('../middleware/auth.middleware');
const { uploadSoporte } = require('../middleware/upload.middleware');
const { ROLES } = require('../constants/roles');

const router = Router();

router.post('/', uploadSoporte, controller.createSoporte);
router.get('/', verifyToken, verifyRole(ROLES.ADMIN), controller.getSoportes);
router.get('/:id', verifyToken, verifyRole(ROLES.ADMIN), controller.getSoporteById);
router.patch('/:id/responder', verifyToken, verifyRole(ROLES.ADMIN), controller.responderSoporte);
router.patch('/:id/estado', verifyToken, verifyRole(ROLES.ADMIN), controller.updateEstadoSoporte);

module.exports = router;
