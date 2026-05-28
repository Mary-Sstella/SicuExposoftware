const { Router } = require('express');
const controller = require('./resena.controller');
const { verifyToken, verifyRole } = require('../../shared/middleware/auth.middleware');
const { ROLES } = require('../../shared/constants/roles');

const router = Router();

router.post('/', verifyToken, verifyRole(ROLES.ESTUDIANTE), controller.createResena);
router.get('/', verifyToken, verifyRole(ROLES.ADMIN), controller.getResenas);
router.get('/mis-resenas', verifyToken, verifyRole(ROLES.ESTUDIANTE), controller.getMisResenas);
router.get('/publicas', controller.getResenasPublicas);
router.patch('/:id/publicar', verifyToken, verifyRole(ROLES.ADMIN), controller.togglePublicado);


module.exports = router;
