import api from '../../../shared/api/axios'

export const getCarreras = async () => {
    const res = await api.get('/estadisticas/carreras')
    return res.data
}

export const getAsistenciaMensual = async () => {
    const res = await api.get('/estadisticas/asistencia-mensual')
    return res.data
}