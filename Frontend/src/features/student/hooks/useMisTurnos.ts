import { useCallback, useEffect, useState } from "react"
import { useAuthStore } from "../../auth/store/authStore"
import { getMiTurnoHoy } from "../services/estudianteService"
// hook para obtener el turno del dia del estudiante
// el componente EstudiantePage para mostrar la informacion del turno del dia


interface MiTurno {
    id_reserva: number | null
    numero_turno: number | null
    hora_inicio: string | null
    hora_fin: string | null
    fecha: string
    estado: string
    lunes: boolean
    martes: boolean
    miercoles: boolean
    jueves: boolean
    viernes: boolean
}

export function useMisTurnos(){
    const {id_estudiante} = useAuthStore()
    const [turno, setTurno] = useState<MiTurno | null>(null)
    const [loading, setLoading] = useState(true)

    const fetchTurno = useCallback(async()=>{
        if(!id_estudiante) return
        setLoading(true)
        try{
            const data = await getMiTurnoHoy(id_estudiante)
            setTurno(data)
        }catch{
            setTurno(null)
        }finally{
            setLoading(false)
        }
    }, [id_estudiante])

    useEffect(()=>{fetchTurno()}, [fetchTurno])
    return{turno, loading}

}