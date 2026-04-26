const { Router } = require('express')
const controller = require('./estudiante.controller')
const { verifyToken, verifyRole } = require('../auth/auth.middleware')
const { validate } = require('../../shared/middleware/validate.middleware')
const { createEstudianteValidator, updateEstudianteValidator } = require('./estudiante.validator')

const router = Router()

router.get('/', verifyToken, controller.getEstudiantes)
router.get('/dias', verifyToken, verifyRole('ADMIN'), controller.getEstudiantesDias)
router.get('/:id', verifyToken, controller.getEstudianteById)
router.get('/:id/dias', verifyToken, verifyRole('ADMIN'), controller.getEstudianteDias)
router.post('/', verifyToken, verifyRole('ADMIN'), createEstudianteValidator, validate, controller.createEstudiante)
router.put('/:id', verifyToken, verifyRole('ADMIN'), updateEstudianteValidator, validate, controller.updateEstudiante)
router.delete('/:id', verifyToken, verifyRole('ADMIN'), controller.deleteEstudiante)

module.exports = router