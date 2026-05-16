
import api from '../../../shared/api/axios'


export const getInscripciones = async ()=>{
    const res = await api.get('/inscripciones')
    return res.data
}

export const getInscripcionById = async (id: number)=>{
    const res = await api.get(`/inscripciones/${id}`)
    return res.data
}

export const aprobarInscripcion = async (id: number)=>{
    const res = await api.patch(`/inscripciones/${id}/estado`, {estado: 'APROBADO'})
    return res.data
}

export const rechazarInscripcion = async (id: number)=>{
    const res = await api.patch(`/inscripciones/${id}/estado`, {estado: 'RECHAZADO'})
    return res.data
}

export const createInscripcion = async (formData: FormData) => {
  const res = await api.post('/inscripciones', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return res.data
}

