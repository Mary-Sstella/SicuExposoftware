const estudianteRepository = require('./estudiante.repository')

const getEstudiantes = async () => {
    return await estudianteRepository.getEstudiantes()
}

module.exports = {
    getEstudiantes
}