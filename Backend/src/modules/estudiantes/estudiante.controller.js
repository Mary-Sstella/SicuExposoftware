const estudianteService = require('./estudiante.service')
const { AppError } = require('../../shared/middleware/error.middleware')
const { MESSAGES } = require('../../shared/constants/messages')
const pool = require('../../config/db')
const prisma = require('../../config/prisma')

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
            throw new AppError(404, MESSAGES.ESTUDIANTE_NO_ENCONTRADO)
        }

        res.json(data)
    } catch (error) {
        next(error)
    }
}

const getEstudiantesDias = async (req, res, next) => {
    try {
        const result = await pool.query(
            `SELECT 
            e.id_estudiante,
            e.nombres,
            e.apellidos,
            e.numero_identificacion,
            e.correo_institucional,
            e.correo_personal,
            e.programa,
            e.estado,
            e.contador_inasistencias,
            r.numero_turno AS turno,
            r.lunes,
            r.martes,
            r.miercoles,
            r.jueves,
            r.viernes
            FROM estudiante e
            LEFT JOIN LATERAL (
                SELECT numero_turno, lunes, martes, miercoles, jueves, viernes
                FROM reservas
                WHERE id_estudiante = e.id_estudiante
                ORDER BY id_reserva DESC
                LIMIT 1
            ) r ON true
            ORDER BY e.apellidos ASC`
        )


        res.json(result.rows.map(row => ({
            id_estudiante: row.id_estudiante,
            nombres: row.nombres,
            apellidos: row.apellidos,
            numero_identificacion: row.numero_identificacion,
            correo_institucional: row.correo_institucional,
            correo_personal: row.correo_personal,
            programa: row.programa,
            estado: row.estado,
            contador_inasistencias: row.contador_inasistencias,
            turno: row.turno,
            dias: {
                lunes: row.lunes,
                martes: row.martes,
                miercoles: row.miercoles,
                jueves: row.jueves,
                viernes: row.viernes
            }
        })))
    } catch (error) {
        next(error)
    }
}

const getEstudianteDias = async (req, res, next) => {
    try {
        const { id } = req.params
        const result = await pool.query(
            `SELECT 
                e.id_estudiante,
                e.nombres,
                e.apellidos,
                e.numero_identificacion,
                e.correo_institucional,
                e.programa,
                e.estado,
                e.contador_inasistencias,
                r.numero_turno AS turno,
                r.lunes,
                r.martes,
                r.miercoles,
                r.jueves,
                r.viernes
            FROM estudiante e
            LEFT JOIN reservas r ON e.id_estudiante = r.id_estudiante
            WHERE e.id_estudiante = $1`,
            [id]
        )

        if (result.rows.length === 0) {
            throw new AppError(404, MESSAGES.ESTUDIANTE_NO_ENCONTRADO)
        }

        const row = result.rows[0]

        res.json({
            id_estudiante: row.id_estudiante,
            nombres: row.nombres,
            apellidos: row.apellidos,
            numero_identificacion: row.numero_identificacion,
            correo_institucional: row.correo_institucional,
            programa: row.programa,
            estado: row.estado,
            contador_inasistencias: row.contador_inasistencias,
            turno: row.turno,
            dias: {
                lunes: row.lunes,
                martes: row.martes,
                miercoles: row.miercoles,
                jueves: row.jueves,
                viernes: row.viernes
            }
        })
    } catch (error) {
        next(error)
    }
}

const createEstudiante = async (req, res, next) => {
    try {
        const data = await estudianteService.createEstudiante(req.body)

        await prisma.actividades.create({
            data: {
                tipo: 'ESTUDIANTE_CREADO',
                descripcion: `Nuevo estudiante inscrito: ${data.nombres} ${data.apellidos}`,
                id_usuario: req.usuario.id
            }
        })

        res.status(201).json(data)
    } catch (error) {
        if (error?.code === 'P2002') {
            return next(new AppError(409, MESSAGES.ESTUDIANTE_DUPLICADO))
        }
        next(error)
    }
}

const updateEstudiante = async (req, res, next) => {
    try {
        const { id } = req.params
        const result = await estudianteService.updateEstudiante(id, req.body)

        if (!result) {
            throw new AppError(404, MESSAGES.ESTUDIANTE_NO_ENCONTRADO)
        }

        await prisma.actividades.create({
            data: {
                tipo: 'ESTUDIANTE_ACTUALIZADO',
                descripcion: `Estudiante actualizado: ${result.nombres} ${result.apellidos}`,
                id_usuario: req.usuario.id
            }
        })

        res.json({ msg: MESSAGES.ESTUDIANTE_ACTUALIZADO, estudiante: result })
    } catch (error) {
        next(error)
    }
}

const updateEstudianteDias = async (req, res, next) => {
    try {
        const { id } = req.params
        const result = await estudianteService.updateEstudianteDias(id, req.body)

        if (!result) {
            throw new AppError(404, MESSAGES.ESTUDIANTE_NO_ENCONTRADO)
        }

        res.json({ msg: MESSAGES.ESTUDIANTE_ACTUALIZADO, estudiante: result })
    } catch (error) {
        if (error.message === 'SIN_RESERVA') {
            return next(new AppError(404, 'El estudiante no tiene reserva para esa fecha'))
        }
        next(error)
    }
}

const deleteEstudiante = async (req, res, next) => {
    try {
        const { id } = req.params
        const result = await estudianteService.deleteEstudiante(id)

        if (!result) {
            throw new AppError(404, MESSAGES.ESTUDIANTE_NO_ENCONTRADO)
        }

        await prisma.actividades.create({
            data: {
                tipo: 'ESTUDIANTE_ELIMINADO',
                descripcion: `Estudiante eliminado: ${result.nombres} ${result.apellidos}`,
                id_usuario: req.usuario.id
            }
        })

        res.json({ msg: MESSAGES.ESTUDIANTE_ELIMINADO, estudiante: result })
    } catch (error) {
        next(error)
    }
}

const resetPassword = async (req, res, next) => {
    try {
        const { id } = req.params
        const estudiante = await prisma.estudiante.findUnique({
            where: { id_estudiante: parseInt(id) },
            select: { numero_identificacion: true }
        })
        if (!estudiante) return next(new AppError(404, 'Estudiante no encontrado'))

        const hash = await bcrypt.hash(estudiante.numero_identificacion.toString(), 10)
        await prisma.usuarios.updateMany({
            where: { id_estudiante: parseInt(id) },
            data: { password_hash: hash }
        })
        res.json({ msg: 'Contraseña restablecida a número de cédula' })
    } catch (error) {
        next(error)
    }
}


module.exports = {
    getEstudiantes,
    getEstudianteById,
    getEstudiantesDias,
    getEstudianteDias,
    createEstudiante,
    updateEstudiante,
    updateEstudianteDias,
    deleteEstudiante,
    resetPassword
}