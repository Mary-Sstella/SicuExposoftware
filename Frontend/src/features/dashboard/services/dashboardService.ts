import api from '../../../shared/api/axios'
// Llama al endpoint de resumen y retorna los datos directamente

export const getDashboardSummary = async () => {
  const res = await api.get('/dashboard/summary')
  return res.data
}
