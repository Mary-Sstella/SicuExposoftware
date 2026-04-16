const { Router } = require('express')
const controller = require('./user.controller')

const router = Router()

router.get('/', controller.getUsuarios)
router.get('/:id', controller.getUsuarioById)
router.post('/', controller.createUsuario)
router.put('/:id', controller.updateUsuario)
router.delete('/:id', controller.deleteUsuario)

module.exports = router