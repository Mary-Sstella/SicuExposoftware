const { Router } = require('express')
const controller = require('./user.controller')
const { verifyToken, verifyRole } = require('../auth/auth.middleware')
const { validate } = require('../../shared/middleware/validate.middleware')
const { createUsuarioValidator, updateUsuarioValidator } = require('./user.validator')
const { ROLES } = require('../../shared/constants/roles')

const router = Router()

router.get('/', verifyToken, verifyRole(ROLES.ADMIN), controller.getUsuarios)
router.get('/:id', verifyToken, verifyRole(ROLES.ADMIN), controller.getUsuarioById)
router.post('/', verifyToken, verifyRole(ROLES.ADMIN), createUsuarioValidator, validate, controller.createUsuario)
router.put('/:id', verifyToken, verifyRole(ROLES.ADMIN), updateUsuarioValidator, validate, controller.updateUsuario)
router.delete('/:id', verifyToken, verifyRole(ROLES.ADMIN), controller.deleteUsuario)

module.exports = router