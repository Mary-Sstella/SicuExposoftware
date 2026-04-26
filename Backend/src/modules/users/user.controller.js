const userService = require('./user.service')
const { AppError } = require('../../shared/middleware/error.middleware')
const pool = require('../../config/db')

// Obtener todos los usuarios
const getUsuarios = async (req, res, next) => {
    try {
        const data = await userService.getUsuarios()
        res.json(data)
    } catch (error) {
        next(error)
    }
}

// Obtener usuario por ID
const getUsuarioById = async (req, res, next) => {
    try {
        const { id } = req.params
        const data = await userService.getUsuarioById(id)

        if (!data) {
            throw new AppError(404, 'Usuario no encontrado')
        }

        res.json(data)
    } catch (error) {
        next(error)
    }
}

// Crear usuario
const createUsuario = async (req, res, next) => {
    try {
        const data = await userService.createUsuario(req.body)

        await pool.query(
            `INSERT INTO actividades (tipo, descripcion, id_usuario) VALUES ($1, $2, $3)`,
            ['USUARIO_CREADO', `Nuevo usuario creado: ${data.username || data.email}`, req.usuario.id]
        )

        res.status(201).json(data)
    } catch (error) {
        if (error?.code === '23505') {
            return next(new AppError(409, 'El correo o username ya está registrado'))
        }
        next(error)
    }
}

// Actualizar usuario
const updateUsuario = async (req, res, next) => {
    try {
        const { id } = req.params
        const { rows, rowCount } = await userService.updateUsuario(id, req.body)

        if (rowCount === 0) {
            throw new AppError(404, 'Usuario no encontrado')
        }

        await pool.query(
            `INSERT INTO actividades (tipo, descripcion, id_usuario) VALUES ($1, $2, $3)`,
            ['USUARIO_ACTUALIZADO', `Usuario actualizado: ${rows[0].username || rows[0].email}`, req.usuario.id]
        )

        res.json({ msg: 'Usuario actualizado', usuario: rows[0] })
    } catch (error) {
        next(error)
    }
}

// Eliminar usuario
const deleteUsuario = async (req, res, next) => {
    try {
        const { id } = req.params
        const { rows, rowCount } = await userService.deleteUsuario(id)

        if (rowCount === 0) {
            throw new AppError(404, 'Usuario no encontrado')
        }

        await pool.query(
            `INSERT INTO actividades (tipo, descripcion, id_usuario) VALUES ($1, $2, $3)`,
            ['USUARIO_ELIMINADO', `Usuario eliminado: ${rows[0].username || rows[0].email}`, req.usuario.id]
        )

        res.json({ msg: 'Usuario eliminado', usuario: rows[0] })
    } catch (error) {
        next(error)
    }
}
module.exports = {
    getUsuarios,
    getUsuarioById,
    createUsuario,
    updateUsuario,
    deleteUsuario
}