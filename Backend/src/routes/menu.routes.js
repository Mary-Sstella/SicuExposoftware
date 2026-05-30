const { Router } = require('express');
const controller = require('../controllers/menu.controller');
const { verifyToken, verifyRole } = require('../middleware/auth.middleware');
const { uploadMenu } = require('../middleware/upload.middleware');
const { ROLES } = require('../constants/roles');

const router = Router();

router.get('/', controller.getMenu);
router.post('/', verifyToken, verifyRole(ROLES.ADMIN), uploadMenu, controller.uploadMenu);
router.delete('/', verifyToken, verifyRole(ROLES.ADMIN), controller.deleteMenu);

module.exports = router;
