const pool = require('../../config/db')

const validarHuella = async (finger_id) => {

  // 1. Buscar estudiante por finger_id
  const huellaResult = await pool.query(
    `SELECT h.id_estudiante, e.nombres, e.apellidos
     FROM huellas h
     JOIN estudiante e ON h.id_estudiante = e.id_estudiante
     WHERE h.finger_id = $1`,
    [finger_id]
  )

  if (huellaResult.rows.length === 0) {
    return { success: false, mensaje: 'Huella no registrada' }
  }

  const { id_estudiante, nombres, apellidos } = huellaResult.rows[0]
  const nombre = `${nombres} ${apellidos}`

  // 2. Verificar si ya fue entregado hoy
  const yaEntregado = await pool.query(
    `SELECT id_detalle FROM detalle_reserva
     WHERE id_estudiante = $1
     AND fecha_comida = CURRENT_DATE
     AND estado = 'ENTREGADO'
     LIMIT 1`,
    [id_estudiante]
  )

  if (yaEntregado.rows.length > 0) {
    return {
      success: false,
      mensaje: 'Almuerzo ya fue entregado hoy',
      estudiante: { id: id_estudiante, nombre }
    }
  }

  // 3. Verificar si tiene almuerzo pendiente hoy
  const almuerzoPendiente = await pool.query(
    `SELECT id_detalle FROM detalle_reserva
     WHERE id_estudiante = $1
     AND fecha_comida = CURRENT_DATE
     AND estado = 'PENDIENTE'
     LIMIT 1`,
    [id_estudiante]
  )

  if (almuerzoPendiente.rows.length === 0) {
    return {
      success: false,
      mensaje: 'No tiene almuerzo asignado para hoy',
      estudiante: { id: id_estudiante, nombre }
    }
  }

  // 4. Marcar como entregado
  await pool.query(
    `UPDATE detalle_reserva
     SET estado = 'ENTREGADO',
         asistio = 'SI',
         fecha_entrega = CURRENT_TIMESTAMP
     WHERE id_detalle = $1`,
    [almuerzoPendiente.rows[0].id_detalle]
  )

  return {
    success: true,
    mensaje: 'Almuerzo autorizado',
    estudiante: { id: id_estudiante, nombre }
  }
}

module.exports = { validarHuella }