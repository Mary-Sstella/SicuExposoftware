const { Router } = require('express')
const controller = require('../controllers/user.controller')
const { verifyToken, verifyRole } = require('../middleware/auth.middleware')
const { validate } = require('../middleware/validate.middleware')
const { createUsuarioValidator, updateUsuarioValidator } = require('../middleware/user.validator')
const { ROLES } = require('../constants/roles')

const router = Router()

router.get('/', verifyToken, verifyRole(ROLES.ADMIN), controller.getUsuarios)
router.get('/:id', verifyToken, verifyRole(ROLES.ADMIN), controller.getUsuarioById)
router.post('/', verifyToken, verifyRole(ROLES.ADMIN), createUsuarioValidator, validate, controller.createUsuario)
router.put('/:id', verifyToken, verifyRole(ROLES.ADMIN), updateUsuarioValidator, validate, controller.updateUsuario)
router.delete('/:id', verifyToken, verifyRole(ROLES.ADMIN), controller.deleteUsuario)

module.exports = router