const pool = require('../../config/db')
const { AppError } = require('../../shared/middleware/error.middleware')

const getSummary = async (req, res, next) => {
    try {
        const totalEstudiantes = await pool.query(
            'SELECT COUNT(*) FROM estudiante'
        )

        const estudiantesActivos = await pool.query(
            "SELECT COUNT(*) FROM estudiante WHERE estado = 'ACTIVO'"
        )

        const estudiantesInactivos = await pool.query(
            "SELECT COUNT(*) FROM estudiante WHERE estado = 'INACTIVO'"
        )

        const pagosPendientes = await pool.query(
            "SELECT COUNT(*) FROM cartera WHERE estado = 'PENDIENTE'"
        )

        res.json({
            total_estudiantes: parseInt(totalEstudiantes.rows[0].count),
            estudiantes_activos: parseInt(estudiantesActivos.rows[0].count),
            estudiantes_inactivos: parseInt(estudiantesInactivos.rows[0].count),
            pagos_pendientes: parseInt(pagosPendientes.rows[0].count)
        })
    } catch (error) {
        next(error)
    }
}

module.exports = { getSummary }