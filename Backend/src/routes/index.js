const { Router } = require('express')
const userRoutes = require('../modules/users/user.routes')
const estudianteRoutes = require('../modules/estudiantes/estudiante.routes')
const authRoutes = require('../modules/auth/auth.routes')
const dashboardRoutes = require('../modules/dashboard/dashboard.routes')

const router = Router()

router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/estudiantes', estudianteRoutes)
router.use('/dashboard', dashboardRoutes)

module.exports = router