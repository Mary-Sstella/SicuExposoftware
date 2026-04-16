const pool = require('../../config/db')

//Obtener todos los estudiantes
const getEstudiantes = async () => {
    const result = await pool.query('SELECT * FROM estudiante')
    return result.rows
}


//obtener por ID
const getEstudianteById = async (id) => {
    const result = await pool.query(
        'SELECT * FROM estudiante WHERE id_estudiante = $1',
        [id]
    )
    return result.rows[0]
}

//Crear un nuevo registro de estudiante
const createEstudiante = async (data) => {
    const result = await pool.query(
        `INSERT INTO estudiante 
        (numero_identificacion, tipo_identificacion, nombres, apellidos, correo_personal, correo_institucional, programa, estado, contador_inasistencias, limite_inasistencias)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
        RETURNING *`,
        [
            data.numero_identificacion,
            data.tipo_identificacion,
            data.nombres,
            data.apellidos,
            data.correo_personal,
            data.correo_institucional,
            data.programa,
            data.estado,
            data.contador_inasistencias,
            data.limite_inasistencias
        ]
    )
    return result.rows[0]
}

//Actualizar un estudiante
const updateEstudiante = async (id, data) => {
    const result = await pool.query(
        `UPDATE estudiante SET
        nombres = $1,
        apellidos = $2,
        correo_personal = $3,
        programa = $4,
        estado = $5
        WHERE id_estudiante = $6
        RETURNING *`,
        [
            data.nombres,
            data.apellidos,
            data.correo_personal,
            data.programa,
            data.estado,
            id
        ]
    )
    return result
}

//Borrar un estudiante
const deleteEstudiante = async (id) => {
    const result = await pool.query(
        'DELETE FROM estudiante WHERE id_estudiante = $1 RETURNING *',
        [id]
    )
    return result
}



module.exports = {
    getEstudiantes,
    getEstudianteById,
    createEstudiante,
    updateEstudiante,
    deleteEstudiante
}