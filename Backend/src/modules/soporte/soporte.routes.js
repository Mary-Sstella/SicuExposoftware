const { Router } = require('express');
const controller = require('./soporte.controller');
const { verifyToken, verifyRole } = require('../../shared/middleware/auth.middleware');
const { uploadSoporte } = require('../../shared/middleware/upload.middleware');
const { ROLES } = require('../../shared/constants/roles');

const router = Router();

router.post('/', uploadSoporte, controller.createSoporte);
router.get('/', verifyToken, verifyRole(ROLES.ADMIN), controller.getSoportes);
router.get('/:id', verifyToken, verifyRole(ROLES.ADMIN), controller.getSoporteById);
router.patch('/:id/responder', verifyToken, verifyRole(ROLES.ADMIN), controller.responderSoporte);
router.patch('/:id/estado', verifyToken, verifyRole(ROLES.ADMIN), controller.updateEstadoSoporte);

module.exports = router;
