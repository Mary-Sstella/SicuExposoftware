// Generar un username a partir de nombres y apellidos
const generarUsername = (nombres, apellidos) => {
    const primerNombre = nombres.split(' ')[0].toLowerCase()
    const primerApellido = apellidos.split(' ')[0].toLowerCase()
    return `${primerNombre}.${primerApellido}`
}

// Verifica si un string es un correo institucional válido
const esCorreoInstitucional = (correo) => {
    return correo.endsWith('@unicesar.edu.co')
}

module.exports = {
    generarUsername,
    esCorreoInstitucional
}