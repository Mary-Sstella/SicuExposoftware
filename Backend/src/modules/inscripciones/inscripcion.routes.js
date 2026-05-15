const { Router } = require('express');
const controller = require('./inscripcion.controller');
const { verifyToken, verifyRole } = require('../../shared/middleware/auth.middleware');
const { uploadInscripcion } = require('../../shared/middleware/upload.middleware');
const { ROLES } = require('../../shared/constants/roles');

const router = Router();

router.post('/', uploadInscripcion, controller.createInscripcion);
router.get('/', verifyToken, verifyRole(ROLES.ADMIN), controller.getInscripciones);
router.get('/:id', verifyToken, verifyRole(ROLES.ADMIN), controller.getInscripcionById);
router.patch('/:id/estado', verifyToken, verifyRole(ROLES.ADMIN), controller.updateEstadoInscripcion);

module.exports = router;
