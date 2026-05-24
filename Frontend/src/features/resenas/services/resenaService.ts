import api from "../../../shared/api/axios"

export const crearResena = async (calificacion: number, texto: string) =>{
    const res = await api.post('/resenas', {calificacion, texto})
    return res.data 
}

export const getMisResenas = async()=>{
    const res = await api.get('/resenas/mis-resenas')
    return res.data
}

export const getResenas = async () => {
    const res = await api.get('/resenas')
    return res.data
}

export const togglePublicado = async (id: number, publicado: boolean) => {
    const res = await api.patch(`/resenas/${id}/publicar`, { publicado })
    return res.data
}

export const getResenasPublicas = async () => {
    const res = await api.get('/resenas/publicas')
    return res.data
}