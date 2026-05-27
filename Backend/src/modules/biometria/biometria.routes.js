const { Router } = require('express')
const controller = require('./biometria.controller')

const router = Router()

router.post('/validar', controller.validarHuella)

module.exports = router