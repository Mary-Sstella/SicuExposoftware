const { Router } = require('express')
const userRoutes = require('../modules/users/user.routes')
const estudianteRoutes = require('../modules/estudiantes/estudiante.routes')
const authRoutes = require('../modules/auth/auth.routes')
const dashboardRoutes = require('../modules/dashboard/dashboard.routes')
const asistenciaRoutes = require('../modules/asistencia/asistencia.routes')

const router = Router()

router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/estudiantes', estudianteRoutes)
router.use('/dashboard', dashboardRoutes)
router.use('/asistencia', asistenciaRoutes)

module.exports = router