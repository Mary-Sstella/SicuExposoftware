const pool = require('../../config/db')

const getEstudiantes = async () => {
    const result = await pool.query('SELECT * FROM estudiante')
    return result.rows
}

module.exports = {
    getEstudiantes
}