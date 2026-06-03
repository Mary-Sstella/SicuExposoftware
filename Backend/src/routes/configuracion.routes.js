const { Router } = require('express');
const controller = require('../controllers/configuracion.controller');
const { verifyToken, verifyRole } = require('../middleware/auth.middleware');
const { ROLES } = require('../constants/roles');

const router = Router();

router.get('/', controller.getConfiguracion);
router.put('/', verifyToken, verifyRole(ROLES.ADMIN), controller.updateConfiguracion);

module.exports = router;
