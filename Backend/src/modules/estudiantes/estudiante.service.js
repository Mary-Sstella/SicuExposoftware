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