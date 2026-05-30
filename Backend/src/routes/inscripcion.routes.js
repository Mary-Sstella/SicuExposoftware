const { Router } = require('express');
const controller = require('../controllers/inscripcion.controller');
const { verifyToken, verifyRole } = require('../middleware/auth.middleware');
const { uploadInscripcion } = require('../middleware/upload.middleware');
const { ROLES } = require('../constants/roles');

const router = Router();

router.post('/', uploadInscripcion, controller.createInscripcion);
router.get('/', verifyToken, verifyRole(ROLES.ADMIN), controller.getInscripciones);
router.get('/cupos', verifyToken, verifyRole(ROLES.ADMIN), controller.getCupos);
router.get('/:id', verifyToken, verifyRole(ROLES.ADMIN), controller.getInscripcionById);
router.patch('/:id/estado', verifyToken, verifyRole(ROLES.ADMIN), controller.updateEstadoInscripcion);

module.exports = router;
