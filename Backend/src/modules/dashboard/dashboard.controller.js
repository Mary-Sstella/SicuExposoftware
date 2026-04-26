const pool = require('../../config/db')
const { AppError } = require('../../shared/middleware/error.middleware')

const getSummary = async (req, res, next) => {
    try {
        const totalEstudiantes = await pool.query('SELECT COUNT(*) FROM estudiante')
        const estudiantesActivos = await pool.query("SELECT COUNT(*) FROM estudiante WHERE estado = 'ACTIVO'")
        const estudiantesInactivos = await pool.query("SELECT COUNT(*) FROM estudiante WHERE estado = 'INACTIVO'")
        const pagosPendientes = await pool.query("SELECT COUNT(*) FROM cartera WHERE estado = 'PENDIENTE'")
        const asistenciasHoy = await pool.query(
            `SELECT COUNT(*) FROM reservas 
             WHERE estado = 'ENTREGADA' 
             AND fecha = CURRENT_DATE`
        )

        res.json({
            total_estudiantes: parseInt(totalEstudiantes.rows[0].count),
            estudiantes_activos: parseInt(estudiantesActivos.rows[0].count),
            estudiantes_inactivos: parseInt(estudiantesInactivos.rows[0].count),
            pagos_pendientes: parseInt(pagosPendientes.rows[0].count),
            asistencias_hoy: parseInt(asistenciasHoy.rows[0].count)
        })
    } catch (error) {
        next(error)
    }
}

const getAsistenciaSemanal = async (req, res, next) => {
    try {
        const result = await pool.query(
            `SELECT
                SUM(CASE WHEN lunes = true AND estado = 'ENTREGADA' THEN 1 ELSE 0 END) AS lunes_presentes,
                SUM(CASE WHEN lunes = true AND estado != 'ENTREGADA' THEN 1 ELSE 0 END) AS lunes_ausentes,
                SUM(CASE WHEN martes = true AND estado = 'ENTREGADA' THEN 1 ELSE 0 END) AS martes_presentes,
                SUM(CASE WHEN martes = true AND estado != 'ENTREGADA' THEN 1 ELSE 0 END) AS martes_ausentes,
                SUM(CASE WHEN miercoles = true AND estado = 'ENTREGADA' THEN 1 ELSE 0 END) AS miercoles_presentes,
                SUM(CASE WHEN miercoles = true AND estado != 'ENTREGADA' THEN 1 ELSE 0 END) AS miercoles_ausentes,
                SUM(CASE WHEN jueves = true AND estado = 'ENTREGADA' THEN 1 ELSE 0 END) AS jueves_presentes,
                SUM(CASE WHEN jueves = true AND estado != 'ENTREGADA' THEN 1 ELSE 0 END) AS jueves_ausentes,
                SUM(CASE WHEN viernes = true AND estado = 'ENTREGADA' THEN 1 ELSE 0 END) AS viernes_presentes,
                SUM(CASE WHEN viernes = true AND estado != 'ENTREGADA' THEN 1 ELSE 0 END) AS viernes_ausentes
            FROM reservas
            WHERE fecha >= date_trunc('week', CURRENT_DATE)
            AND fecha < date_trunc('week', CURRENT_DATE) + INTERVAL '7 days'`
        )

        const data = result.rows[0]

        res.json([
            { dia: 'Lunes', presentes: parseInt(data.lunes_presentes) || 0, ausentes: parseInt(data.lunes_ausentes) || 0 },
            { dia: 'Martes', presentes: parseInt(data.martes_presentes) || 0, ausentes: parseInt(data.martes_ausentes) || 0 },
            { dia: 'Miércoles', presentes: parseInt(data.miercoles_presentes) || 0, ausentes: parseInt(data.miercoles_ausentes) || 0 },
            { dia: 'Jueves', presentes: parseInt(data.jueves_presentes) || 0, ausentes: parseInt(data.jueves_ausentes) || 0 },
            { dia: 'Viernes', presentes: parseInt(data.viernes_presentes) || 0, ausentes: parseInt(data.viernes_ausentes) || 0 }
        ])  
    } catch (error) {
        next(error)
    }
}

const getActividadesRecientes = async (req, res, next) => {
    try {
        const result = await pool.query(
            `SELECT 
                a.id_actividad,
                a.tipo,
                a.descripcion,
                a.fecha,
                u.username
            FROM actividades a
            LEFT JOIN usuarios u ON a.id_usuario = u.id_usuario
            ORDER BY a.fecha DESC
            LIMIT 10`
        )

        res.json(result.rows)
    } catch (error) {
        next(error)
    }
}

module.exports = { getSummary, getAsistenciaSemanal, getActividadesRecientes }