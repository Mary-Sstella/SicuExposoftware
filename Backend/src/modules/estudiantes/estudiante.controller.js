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
        const data = await estudianteService.getEstudianteById(id)
        
        if (!data) {
            return res.status(404).json({ msg: 'Estudiante no encontrado' })
        }
        
        res.json(data)
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: 'Error obteniendo estudiante' })
    }
}

const createEstudiante = async (req, res) => {
    try {
        const data = await estudianteService.createEstudiante(req.body)
        res.status(201).json(data)
    } catch (error) {
        console.error(error)


        // mandejo de error para violaciones de unique constraint
        if (error?.code === '23505') {
            return res.status(409).json({ msg: 'El número de identificación ya está registrado' })
        }

        res.status(500).json({ msg: 'Error creando estudiante' })
    }
}

const updateEstudiante = async (req, res) => {
    try {
        const { id } = req.params
        const { rows, rowCount } = await estudianteService.updateEstudiante(id, req.body)

        if (rowCount === 0) {
            return res.status(404).json({ msg: 'Estudiante no encontrado' })
        }

        res.json({ msg: 'Estudiante actualizado', estudiante: rows[0] })
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: 'Error actualizando estudiante' })
    }
}

const deleteEstudiante = async (req, res) => {
    try {
        const { id } = req.params
        const { rows, rowCount } = await estudianteService.deleteEstudiante(id)

        if (rowCount === 0) {
            return res.status(404).json({ msg: 'Estudiante no encontrado' })
        }

        res.json({ msg: 'Estudiante eliminado', estudiante: rows[0] })
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