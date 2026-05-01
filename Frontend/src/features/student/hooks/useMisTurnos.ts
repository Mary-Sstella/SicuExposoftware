import { useCallback, useEffect, useState } from "react"
import { useAuthStore } from "../../auth/store/authStore"
import { getMiTurnoHoy } from "../services/estudianteService"


interface MiTurno {
    numero_turno: number
    hora_inicio: string
    hora_fin: string
    fecha: string
    estado: string
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