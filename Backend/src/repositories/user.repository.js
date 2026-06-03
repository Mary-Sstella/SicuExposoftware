const prisma = require('../config/prisma')

// Obtener todos los usuarios
const getUsuarios = async () => {
    return await prisma.usuarios.findMany()
}

// Obtener por ID
const getUsuarioById = async (id) => {
    return await prisma.usuarios.findUnique({
        where: { id_usuario: parseInt(id) }
    })
}

// Crear usuario
const createUsuario = async (data) => {
    return await prisma.usuarios.create({
        data: {
            username: data.username,
            email: data.email,
            password_hash: data.password_hash,
            rol: data.rol,
            id_estudiante: data.id_estudiante ? parseInt(data.id_estudiante) : null
        }
    })
}

// Actualizar usuario
const updateUsuario = async (id, data) => {
    return await prisma.usuarios.update({
        where: { id_usuario: parseInt(id) },
        data: {
            username: data.username,
            email: data.email,
            rol: data.rol,
            activo: data.activo
        }
    })
}

// Eliminar usuario
const deleteUsuario = async (id) => {
    return await prisma.usuarios.delete({
        where: { id_usuario: parseInt(id) }
    })
}

module.exports = {
    getUsuarios,
    getUsuarioById,
    createUsuario,
    updateUsuario,
    deleteUsuario
}