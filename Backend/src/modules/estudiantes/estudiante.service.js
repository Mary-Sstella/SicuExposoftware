const estudianteRepository = require('./estudiante.repository')
const prisma = require('../../config/prisma')
const bcrypt = require('bcryptjs')
const { ROLES } = require('../../shared/constants/roles')

// Obtener todos
const getEstudiantes = async () => {
    return await estudianteRepository.getEstudiantes()
}

// Obtener por ID
const getEstudianteById = async (id) => {
    return await estudianteRepository.getEstudianteById(id)
}

// Crear estudiante y usuario automáticamente
const createEstudiante = async (data) => {
    // Crear estudiante
    const estudiante = await estudianteRepository.createEstudiante(data)

    // Hashear número de identificación como contraseña
    const passwordHash = await bcrypt.hash(data.numero_identificacion.toString(), 10)

    // Crear usuario automáticamente
    await prisma.usuarios.create({
        data: {
            email: estudiante.correo_institucional,
            password_hash: passwordHash,
            rol: ROLES.ESTUDIANTE,
            id_estudiante: estudiante.id_estudiante
        }
    })

    return estudiante
}

// Actualizar datos del estudiante
const updateEstudiante = async (id, data) => {
    return await estudianteRepository.updateEstudiante(id, data)
}

// Actualizar días de reserva
const updateEstudianteDias = async (id, data) => {
    return await estudianteRepository.updateEstudianteDias(id, data)
}

// Eliminar
const deleteEstudiante = async (id) => {
    return await estudianteRepository.deleteEstudiante(id)
}

module.exports = {
    getEstudiantes,
    getEstudianteById,
    createEstudiante,
    updateEstudiante,
    updateEstudianteDias,
    deleteEstudiante
}