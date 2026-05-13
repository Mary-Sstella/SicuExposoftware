import api from "../../../shared/api/axios"
//llama al backend para obtener el turno del dia del estudiante
// se pasa el id del estudiante y retorna la informacion del turno del dia

export const getMiTurnoHoy = async(id_estudiante: number)=>{
    const res= await api.get(`/turnos/estudiante/${id_estudiante}`)
    return res.data
}