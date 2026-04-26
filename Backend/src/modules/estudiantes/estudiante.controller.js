const estudianteService = require('./estudiante.service')
const { AppError } = require('../../shared/middleware/error.middleware')
const pool = require('../../config/db')

const getEstudiantes = async (req, res, next) => {
    try {
        const data = await estudianteService.getEstudiantes()
        res.json(data)
    } catch (error) {
        next(error)
    }
}

const getEstudianteById = async (req, res, next) => {
    try {
        const { id } = req.params
        const data = await estudianteService.getEstudianteById(id)

        if (!data) {
            throw new AppError(404, 'Estudiante no encontrado')
        }

        res.json(data)
    } catch (error) {
        next(error)
    }
}

const createEstudiante = async (req, res, next) => {
    try {
        const data = await estudianteService.createEstudiante(req.body)

        await pool.query(
            `INSERT INTO actividades (tipo, descripcion, id_usuario) VALUES ($1, $2, $3)`,
            ['ESTUDIANTE_CREADO', `Nuevo estudiante inscrito: ${data.nombres} ${data.apellidos}`, req.usuario.id]
        )

        res.status(201).json(data)
    } catch (error) {
        if (error?.code === '23505') {
            return next(new AppError(409, 'El número de identificación ya está registrado'))
        }
        next(error)
    }
}

const updateEstudiante = async (req, res, next) => {
    try {
        const { id } = req.params
        const { rows, rowCount } = await estudianteService.updateEstudiante(id, req.body)

        if (rowCount === 0) {
            throw new AppError(404, 'Estudiante no encontrado')
        }

        await pool.query(
            `INSERT INTO actividades (tipo, descripcion, id_usuario) VALUES ($1, $2, $3)`,
            ['ESTUDIANTE_ACTUALIZADO', `Estudiante actualizado: ${rows[0].nombres} ${rows[0].apellidos}`, req.usuario.id]
        )

        res.json({ msg: 'Estudiante actualizado', estudiante: rows[0] })
    } catch (error) {
        next(error)
    }
}

const deleteEstudiante = async (req, res, next) => {
    try {
        const { id } = req.params
        const { rows, rowCount } = await estudianteService.deleteEstudiante(id)

        if (rowCount === 0) {
            throw new AppError(404, 'Estudiante no encontrado')
        }

        await pool.query(
            `INSERT INTO actividades (tipo, descripcion, id_usuario) VALUES ($1, $2, $3)`,
            ['ESTUDIANTE_ELIMINADO', `Estudiante eliminado: ${rows[0].nombres} ${rows[0].apellidos}`, req.usuario.id]
        )

        res.json({ msg: 'Estudiante eliminado', estudiante: rows[0] })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getEstudiantes,
    getEstudianteById,
    createEstudiante,
    updateEstudiante,
    deleteEstudiante
}