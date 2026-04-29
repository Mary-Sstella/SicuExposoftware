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

const updateEstudianteDias = async (id, data) => {
    // Actualizar datos del estudiante si vienen
    if (data.nombres || data.apellidos || data.correo_personal || data.correo_institucional || data.programa || data.estado) {
        await pool.query(
            `UPDATE estudiante SET
            nombres = COALESCE($1, nombres),
            apellidos = COALESCE($2, apellidos),
            correo_personal = COALESCE($3, correo_personal),
            correo_institucional = COALESCE($4, correo_institucional),
            programa = COALESCE($5, programa),
            estado = COALESCE($6, estado)
            WHERE id_estudiante = $7`,
            [
                data.nombres,
                data.apellidos,
                data.correo_personal,
                data.correo_institucional,
                data.programa,
                data.estado,
                id
            ]
        )
    }

    // Actualizar días de reserva si vienen
    if (data.dias) {
        const reservaExiste = await pool.query(
            'SELECT id_reserva FROM reservas WHERE id_estudiante = $1',
            [id]
        )

        if (reservaExiste.rows.length > 0) {
            await pool.query(
                `UPDATE reservas SET
                lunes = $1,
                martes = $2,
                miercoles = $3,
                jueves = $4,
                viernes = $5
                WHERE id_estudiante = $6`,
                [
                    data.dias.lunes,
                    data.dias.martes,
                    data.dias.miercoles,
                    data.dias.jueves,
                    data.dias.viernes,
                    id
                ]
            )
        } else {
            throw new Error('SIN_RESERVA')
        }
    }

    const result = await pool.query(
        'SELECT * FROM estudiante WHERE id_estudiante = $1',
        [id]
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
    updateEstudianteDias,
    deleteEstudiante
}