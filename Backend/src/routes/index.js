const { Router } = require('express')
const userRoutes = require('../modules/users/user.routes')
const estudianteRoutes = require('../modules/estudiantes/estudiante.routes')
const authRoutes = require('../modules/auth/auth.routes')

const router = Router()

router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/estudiantes', estudianteRoutes)

module.exports = router