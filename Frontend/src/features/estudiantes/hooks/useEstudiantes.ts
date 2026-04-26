import { useEffect, useState } from "react"
import { getEstudiantes } from "../services/estudiantesService"

interface Estudiante {
    id_estudiante: number
    numero_identificacion: string
    tipo_identificacion: string 
    nombres: string
    apellidos: string
    correo_personal: string
    correo_institucional: string
    programa: string
    estado: 'ACTIVO' | 'INACTIVO'
    limite_inasistencia: number
    contador_inasistencias: number
    turno: number | null
    dias: {
        lunes: boolean
        martes: boolean
        miercoles: boolean
        jueves: boolean
        viernes: boolean
    } | null
}

export function useEstudiantes(){
    const [estudiantes,setEstudiantes ] = useState<Estudiante[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        const fetchData = async () =>{
            try{
                const data = await getEstudiantes()
                setEstudiantes(data)
            }finally{
                setLoading(false)
            }
        }
        fetchData()
    },[])

    return {estudiantes, loading}
}