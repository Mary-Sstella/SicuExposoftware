const { Router } = require('express')
const { getEstudiantes } = require('./estudiante.controller')

const router = Router()

router.get('/', getEstudiantes)

module.exports = router