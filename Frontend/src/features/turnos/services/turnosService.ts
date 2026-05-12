import api from '../../../shared/api/axios'

export const getTurnosPorFecha = async (fecha: string, buscar?: string)=>{
    const params: Record<string,string> = {fecha}
    if(buscar) params.buscar = buscar
    const res= await api.get('/turnos', { params })
    return res.data

}

export const getConfiguracion = async () =>{
    const res = await api.get('/turnos/configuracion')
    return res.data
}

export const updateConfiguracion = async (id: number, data: {activo?: boolean; capacidad_maxima?: number })=>{
    const res= await api.put(`/turnos/configuracion/${id}`, data)
    return res.data
}