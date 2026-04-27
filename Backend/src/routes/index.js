const { Router } = require('express')
const userRoutes = require('../modules/users/user.routes')
const estudianteRoutes = require('../modules/estudiantes/estudiante.routes')
const authRoutes = require('../modules/auth/auth.routes')
const dashboardRoutes = require('../modules/dashboard/dashboard.routes')
const reservaRoutes = require('../modules/reservas/reserva.routes')

const router = Router()

router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/estudiantes', estudianteRoutes)
router.use('/dashboard', dashboardRoutes)
router.use('/reservas', reservaRoutes)

module.exports = router