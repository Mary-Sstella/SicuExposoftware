import api from "../../../shared/api/axios"

export const getMiTurnoHoy = async(id_estudiante: number)=>{
    const res= await api.get(`/turnos/estudiante/${id_estudiante}`)
    return res.data
}