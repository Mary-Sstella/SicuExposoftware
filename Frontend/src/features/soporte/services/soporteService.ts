import api from '../../../shared/api/axios'


//Estructira de un ticket de soporte 
export interface Soporte {
    id_soporte: number
    nombre: string | null
    correo: string | null //correo donde se enviara la respuesta 
    asunto: string
    descripcion: string
    estado: 'PENDIENTE' | 'EN_PROCESO' | 'RESUELTO'
    respuesta: string | null //respuesta del admin
    fecha_creacion: string
    fecha_respuesta: string | null
    archivo_url: string | null
}


export interface SoporteDetalle extends Soporte {
    archivo_firmada_url?: string
}

//trae todos los tickets
export const getSoportes = (): Promise<Soporte[]> => api.get('/soporte').then(r => r.data)
//trae un ticket por ID con URL 
export const getSoporteById = (id: number): Promise<SoporteDetalle>=> api.get(`/soporte/${id}`).then(r => r.data)
//Envía la respuesta del admin — el backend manda email automáticamente al estudiante
export const responderSoporte = (id: number, respuesta: string): Promise<Soporte> => api.patch(`/soporte/${id}/responder`, { respuesta }).then(r => r.data)
//cambia el estado del ticket 
export const updateEstadoSoporte = (id: number, estado: string): Promise<Soporte> => api.patch(`/soporte/${id}/estado`, { estado }).then(r => r.data)