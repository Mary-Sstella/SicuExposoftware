const { Router } = require('express')
const userRoutes = require('../modules/users/user.routes')
const estudianteRoutes = require('../modules/estudiantes/estudiante.routes')
const authRoutes = require('../modules/auth/auth.routes')
const dashboardRoutes = require('../modules/dashboard/dashboard.routes')
const reservaRoutes = require('../modules/reservas/reserva.routes')
const asistenciaRoutes = require('../modules/asistencia/asistencia.routes')
const turnoRoutes = require('../modules/turnos/turno.routes')
const inscripcionRoutes = require('../modules/inscripciones/inscripcion.routes')

const router = Router()

router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/estudiantes', estudianteRoutes)
router.use('/dashboard', dashboardRoutes)
router.use('/reservas', reservaRoutes)
router.use('/asistencia', asistenciaRoutes)
router.use('/turnos', turnoRoutes)
router.use('/inscripciones', inscripcionRoutes)

module.exports = router