import api from '../../../shared/api/axios'
// se llama al backend para obtener los datos del resuemen dashboard

export const getDashboardSummary = async () => {
  const res = await api.get('/dashboard/summary')
  return res.data
}
