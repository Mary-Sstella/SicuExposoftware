import api from '../../../shared/api/axios'

export const getCarreras = async () => {
    const res = await api.get('/estadisticas/carreras')
    return res.data
}

export const getAsistenciaMensual = async () => {
    const res = await api.get('/estadisticas/asistencia-mensual')
    return res.data
}

export const getRangosPopulares = async () => {
    const res = await api.get('/estadisticas/rangos-populares')
    return res.data
}

export const exportarEstadisticas = async () => {
    const res = await api.get('/estadisticas/exportar', { responseType: 'blob' })
    const url = window.URL.createObjectURL(new Blob([res.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'estadisticas_sicu.xlsx')
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
}
