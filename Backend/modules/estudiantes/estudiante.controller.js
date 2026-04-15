const estudianteService = require('./estudiante.service')

const getEstudiantes = async (req, res) => {
    try {
        const data = await estudianteService.getEstudiantes()
        res.json(data)
    } catch (error) {
        res.status(500).json({ msg: 'Error obteniendo estudiantes' })
    }
}

module.exports = {
    getEstudiantes
}