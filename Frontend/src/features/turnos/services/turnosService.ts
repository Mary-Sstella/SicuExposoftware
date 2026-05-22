import api from '../../../shared/api/axios'
//llama al backend para obtener los turnos de un dia en especifico
// puede buscar por nombre o id del estudiante

export const getTurnosPorFecha = async (fecha: string, buscar?: string) => {
    const params: Record<string, string> = { fecha }
    if (buscar) params.buscar = buscar
    const res = await api.get('/turnos', { params })
    return res.data.map((t: Record<string, unknown> & { estudiante?: Record<string, unknown> }) => ({
        ...t,
        ...t.estudiante
    }))
}


export const getConfiguracion = async () =>{
    const res = await api.get('/turnos/configuracion')
    return res.data
}

export const updateConfiguracion = async (id: number, data: {activo?: boolean; capacidad_maxima?: number })=>{
    const res= await api.put(`/turnos/configuracion/${id}`, data)
    return res.data
}