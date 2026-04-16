const { Router } = require('express')
const controller = require('./estudiante.controller')

const router = Router()

router.get('/', controller.getEstudiantes)
router.get('/:id', controller.getEstudianteById)
router.post('/', controller.createEstudiante)
router.put('/:id', controller.updateEstudiante)
router.delete('/:id', controller.deleteEstudiante)

module.exports = router