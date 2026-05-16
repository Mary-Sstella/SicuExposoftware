const { Router } = require('express');
const controller = require('./configuracion.controller');
const { verifyToken, verifyRole } = require('../../shared/middleware/auth.middleware');
const { ROLES } = require('../../shared/constants/roles');

const router = Router();

router.get('/', controller.getConfiguracion);
router.put('/', verifyToken, verifyRole(ROLES.ADMIN), controller.updateConfiguracion);

module.exports = router;
