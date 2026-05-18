import api from "../../../shared/api/axios"


export type Configuracion = {
    id: number
    activo: boolean
    fecha_inicio: string | null
    fecha_fin: string | null
    fecha_fin_semestre: string | null
    cupo_lunes: number
    cupo_martes: number
    cupo_miercoles: number
    cupo_jueves: number
    cupo_viernes: number
    precio_comida: number

}

export type ConfiguracionTurno = {
    id_configuracion: number
    hora_inicio: string
    hora_fin: string
    capacidad_maxima: number
    activo: boolean
}

export const getConfiguracion = async (): Promise<Configuracion> =>{
    const response = await api.get('/configuracion-formulario')
    return response.data
}

export const updateConfiguracion = async (data: Partial<Configuracion>) =>{
    const response = await api.put('/configuracion-formulario', data)
    return response.data
}

export const getConfiguracionTurnos = async (): Promise<ConfiguracionTurno[]> =>{
    const response = await api.get('/turnos/configuracion')
    return response.data
}

export const updateConfiguracionTurno = async (id: number, capacidad_maxima: number) =>{
    const response = await api.put(`/turnos/configuracion/${id}`, { capacidad_maxima }) 
    return response.data
}


