const { Router } = require('express')
const controller = require('./user.controller')
const { verifyToken, verifyRole } = require('../auth/auth.middleware')

const router = Router()

router.get('/', verifyToken, verifyRole('ADMIN'), controller.getUsuarios)
router.get('/:id', verifyToken, verifyRole('ADMIN'), controller.getUsuarioById)
router.post('/', verifyToken, verifyRole('ADMIN'), controller.createUsuario)
router.put('/:id', verifyToken, verifyRole('ADMIN'), controller.updateUsuario)
router.delete('/:id', verifyToken, verifyRole('ADMIN'), controller.deleteUsuario)

module.exports = router