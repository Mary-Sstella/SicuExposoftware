import api from "../../../shared/api/axios"


export const getEstudiantes = async () =>{
    const res = await api.get('/estudiantes/dias')
    return res.data 
}