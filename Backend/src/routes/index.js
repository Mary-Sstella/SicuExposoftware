const { Router } = require('express')
const userRoutes = require('../modules/users/user.routes')
const estudianteRoutes = require('../modules/estudiantes/estudiante.routes')

const router = Router()

router.use('/users', userRoutes)
router.use('/estudiantes', estudianteRoutes)

module.exports = router