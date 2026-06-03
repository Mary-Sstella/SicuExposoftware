// Formatea una fecha a formato legible
const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-CO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    })
}

// Formatea un nombre completo con la primera letra en mayúscula
const formatearNombre = (nombre) => {
    return nombre
        .toLowerCase()
        .split(' ')
        .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
        .join(' ')
}

// Formatea un número de identificación eliminando espacios
const formatearIdentificacion = (identificacion) => {
    return identificacion.toString().replace(/\s/g, '')
}

module.exports = {
    formatearFecha,
    formatearNombre,
    formatearIdentificacion
}