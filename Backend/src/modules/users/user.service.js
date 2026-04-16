const userRepository = require('./user.repository')

// Obtener todos
const getUsuarios = async () => {
    return await userRepository.getUsuarios()
}

// Obtener por ID
const getUsuarioById = async (id) => {
    return await userRepository.getUsuarioById(id)
}

// Crear
const createUsuario = async (data) => {
    return await userRepository.createUsuario(data)
}

// Actualizar
const updateUsuario = async (id, data) => {
    return await userRepository.updateUsuario(id, data)
}

// Eliminar
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