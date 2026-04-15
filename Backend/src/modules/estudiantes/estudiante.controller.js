const estudianteService = require('./estudiante.service')

const getEstudiantes = async (req, res) => {
    try {
        const data = await estudianteService.getEstudiantes()
        res.json(data)
    } catch (error) {
        res.status(500).json({ msg: 'Error obteniendo estudiantes' })
    }
}

const getEstudianteById = async (req, res) => {
    try {
        const { id } = req.params
        const data = await estudianteService.getEstudianteById(id)  // ✅
        res.json(data)
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: 'Error obteniendo estudiante' })
    }
}

const createEstudiante = async (req, res) => {
    try {
        const data = await estudianteService.createEstudiante(req.body)  // ✅
        res.status(201).json(data)
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: 'Error creando estudiante' })
    }
}

const updateEstudiante = async (req, res) => {
    try {
        const { id } = req.params
        const data = await estudianteService.updateEstudiante(id, req.body)  // ✅
        res.json(data)
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: 'Error actualizando estudiante' })
    }
}

const deleteEstudiante = async (req, res) => {
    try {
        const { id } = req.params
        const data = await estudianteService.deleteEstudiante(id)  // ✅
        res.json(data)
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: 'Error eliminando estudiante' })
    }
}

module.exports = {
    getEstudiantes,
    getEstudianteById,
    createEstudiante,
    updateEstudiante,
    deleteEstudiante
}