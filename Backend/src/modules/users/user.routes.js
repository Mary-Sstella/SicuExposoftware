const { Router } = require('express')
const controller = require('./user.controller')
const { verifyToken, verifyRole } = require('../auth/auth.middleware')
const { validate } = require('../../shared/middleware/validate.middleware')
const { createUsuarioValidator, updateUsuarioValidator } = require('./user.validator')

const router = Router()

router.get('/', verifyToken, verifyRole('ADMIN'), controller.getUsuarios)
router.get('/:id', verifyToken, verifyRole('ADMIN'), controller.getUsuarioById)
router.post('/', verifyToken, verifyRole('ADMIN'), createUsuarioValidator, validate, controller.createUsuario)
router.put('/:id', verifyToken, verifyRole('ADMIN'), updateUsuarioValidator, validate, controller.updateUsuario)
router.delete('/:id', verifyToken, verifyRole('ADMIN'), controller.deleteUsuario)

module.exports = router