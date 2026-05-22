import api from "../../../shared/api/axios"
//llama al backend para obtener el turno del dia del estudiante
// se pasa el id del estudiante y retorna la informacion del turno del dia

export const getMiTurnoHoy = async(id_estudiante: number)=>{
    const res= await api.get(`/turnos/estudiante/${id_estudiante}`)
    return res.data
}

export const getDiasEstudiante = async (id_estudiante: number) =>{
    const res = await api.get(`/turnos/estudiante/${id_estudiante}/dias`)
    return res.data
}

export const getReservaActiva = async (id_estudiante: number) =>{
    const res = await api.get(`/turnos/estudiante/${id_estudiante}/activa`)
    return res.data
}

export const getDisponibilidad = async (fecha: string) => {
    const res = await api.get(`/turnos/disponibilidad`, { params: { fecha } })
    return res.data
}

export const crearReserva = async (id_estudiante: number, fecha: string, id_configuracion:number)=>{
    const res = await api.post(`/turnos/estudiante/${id_estudiante}/reservar`, { fecha, id_configuracion })
    return res.data
}