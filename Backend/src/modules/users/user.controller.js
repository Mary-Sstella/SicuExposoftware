const userService = require('./user.service')

// Obtener todos los usuarios
const getUsuarios = async (req, res) => {
    try {
        const data = await userService.getUsuarios()
        res.json(data)
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: 'Error obteniendo usuarios' })
    }
}

// Obtener usuario por ID
const getUsuarioById = async (req, res) => {
    try {
        const { id } = req.params
        const data = await userService.getUsuarioById(id)

        if (!data) {
            return res.status(404).json({ msg: 'Usuario no encontrado' })
        }

        res.json(data)
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: 'Error obteniendo usuario' })
    }
}

// Crear usuario
const createUsuario = async (req, res) => {
    try {
        const data = await userService.createUsuario(req.body)
        res.status(201).json(data)
    } catch (error) {
        console.error(error)

        if (error?.code === '23505') {
            return res.status(409).json({ msg: 'El correo o username ya está registrado' })
        }

        res.status(500).json({ msg: 'Error creando usuario' })
    }
}

// Actualizar usuario
const updateUsuario = async (req, res) => {
    try {
        const { id } = req.params
        const { rows, rowCount } = await userService.updateUsuario(id, req.body)

        if (rowCount === 0) {
            return res.status(404).json({ msg: 'Usuario no encontrado' })
        }

        res.json({ msg: 'Usuario actualizado', usuario: rows[0] })
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: 'Error actualizando usuario' })
    }
}

// Eliminar usuario
const deleteUsuario = async (req, res) => {
    try {
        const { id } = req.params
        const { rows, rowCount } = await userService.deleteUsuario(id)

        if (rowCount === 0) {
            return res.status(404).json({ msg: 'Usuario no encontrado' })
        }

        res.json({ msg: 'Usuario eliminado', usuario: rows[0] })
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: 'Error eliminando usuario' })
    }
}

module.exports = {
    getUsuarios,
    getUsuarioById,
    createUsuario,
    updateUsuario,
    deleteUsuario
}