const { Router } = require('express');
const controller = require('./menu.controller');
const { verifyToken, verifyRole } = require('../../shared/middleware/auth.middleware');
const { uploadMenu } = require('../../shared/middleware/upload.middleware');
const { ROLES } = require('../../shared/constants/roles');

const router = Router();

router.get('/', controller.getMenu);
router.post('/', verifyToken, verifyRole(ROLES.ADMIN), uploadMenu, controller.uploadMenu);
router.delete('/', verifyToken, verifyRole(ROLES.ADMIN), controller.deleteMenu);

module.exports = router;
