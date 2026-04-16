const { Router } = require('express')
const controller = require('./estudiante.controller')
const { verifyToken } = require('../auth/auth.middleware')

const router = Router()

router.get('/', verifyToken, controller.getEstudiantes)
router.get('/:id', verifyToken, controller.getEstudianteById)
router.post('/', verifyToken, controller.createEstudiante)
router.put('/:id', verifyToken, controller.updateEstudiante)
router.delete('/:id', verifyToken, controller.deleteEstudiante)

module.exports = router