const userRepository = require('./user.repository')
const bcrypt = require('bcryptjs')

// Obtener todos
const getUsuarios = async () => {
    return await userRepository.getUsuarios()
}

// Obtener por ID
const getUsuarioById = async (id) => {
    return await userRepository.getUsuarioById(id)
}

// Crear usuario con password hasheado
const createUsuario = async (data) => {
    const hash = await bcrypt.hash(data.password_hash, 10)
    return await userRepository.createUsuario({ ...data, password_hash: hash })
}

// Actualizar usuario
const updateUsuario = async (id, data) => {
    return await userRepository.updateUsuario(id, data)
}

// Eliminar usuario
const deleteUsuario = async (id) => {
    return await userRepository.deleteUsuario(id)
}

module.exports = {
    getUsuarios,
    getUsuarioById,
    createUsuario,
    updateUsuario,
    deleteUsuario
}