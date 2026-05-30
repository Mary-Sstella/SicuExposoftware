import api from "../../../shared/api/axios"

export const getNotificaciones = async () => {
    const res = await api.get('/notificaciones')
    return res.data
}

export const marcarLeida = async (id_notificacion: number) => {
    const res = await api.patch(`/notificaciones/${id_notificacion}/leer`)
    return res.data
}

export const marcarTodasLeidas = async () => {
    const res = await api.patch('/notificaciones/leer-todas')
    return res.data
}
