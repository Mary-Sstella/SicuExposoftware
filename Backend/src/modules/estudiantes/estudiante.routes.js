const { Router } = require('express')
const controller = require('./estudiante.controller')
const { verifyToken, verifyRole } = require('../../shared/middleware/auth.middleware')
const { validate } = require('../../shared/middleware/validate.middleware')
const { createEstudianteValidator, updateEstudianteValidator } = require('./estudiante.validator')
const { ROLES } = require('../../shared/constants/roles')

const router = Router()

router.get('/', verifyToken, controller.getEstudiantes)
router.get('/dias', verifyToken, verifyRole(ROLES.ADMIN), controller.getEstudiantesDias)
router.get('/:id', verifyToken, controller.getEstudianteById)
router.get('/:id/dias', verifyToken, verifyRole(ROLES.ADMIN), controller.getEstudianteDias)
router.post('/', verifyToken, verifyRole(ROLES.ADMIN), createEstudianteValidator, validate, controller.createEstudiante)
router.put('/:id', verifyToken, verifyRole(ROLES.ADMIN), updateEstudianteValidator, validate, controller.updateEstudiante)
router.put('/:id/dias', verifyToken, verifyRole(ROLES.ADMIN), controller.updateEstudianteDias)
router.delete('/:id', verifyToken, verifyRole(ROLES.ADMIN), controller.deleteEstudiante)
router.post('/:id/reset-password', verifyToken, verifyRole(ROLES.ADMIN), controller.resetPassword)

module.exports = router