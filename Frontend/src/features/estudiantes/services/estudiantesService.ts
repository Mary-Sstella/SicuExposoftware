import api from "../../../shared/api/axios"


export const getEstudiantes = async () =>{
    const res = await api.get('/estudiantes')
    return res.data 
}