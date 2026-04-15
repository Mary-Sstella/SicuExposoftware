const estudianteRepository = require('./estudiante.repository')

// Obtener todos
const getEstudiantes = async () => {
    return await estudianteRepository.getEstudiantes()
}

// Obtener por ID
const getEstudianteById = async (id) => {
    return await estudianteRepository.getEstudianteById(id)
}

// Crear
const createEstudiante = async (data) => {
    return await estudianteRepository.createEstudiante(data)
}

// Actualizar
const updateEstudiante = async (id, data) => {
    return await estudianteRepository.updateEstudiante(id, data)
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
    deleteEstudiante
}