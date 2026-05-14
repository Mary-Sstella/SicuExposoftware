import api from "../../../shared/api/axios"
// servicio para llamar al backend y obtener la lista de estudiantes con sus dias de asistencia

export const getAsistenciasHoy = async () => {
  const res = await api.get('/reservas/asistencia-hoy')
  return res.data
}
