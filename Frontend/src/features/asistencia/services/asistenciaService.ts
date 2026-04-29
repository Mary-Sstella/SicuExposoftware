import api from "../../../shared/api/axios"

export const getAsistenciasHoy = async () => {
  const res = await api.get('/reservas/asistencia-hoy')
  return res.data
}
