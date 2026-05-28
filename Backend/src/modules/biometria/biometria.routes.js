const { Router } = require('express')
const controller = require('./biometria.controller')

const router = Router()

router.post('/registrar', controller.registrarHuella)
router.get('/estudiante/:cedula', controller.getEstudiantePorCedula)
router.post('/validar', controller.validarHuella)

module.exports = router