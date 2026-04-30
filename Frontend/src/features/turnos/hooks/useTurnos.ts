import { useCallback, useEffect, useState } from "react"
//useCallback: memoriza una función para que no se recree innecesariamente.
import { getTurnosPorFecha } from "../services/turnosService"


interface Turno{
    numero_turno: number
    hora_inicio: string
    hora_fin: string
    nombres: string
    apellidos: string
    numero_identificacion: string
    programa: string
    estado: string
}

//custom hook
export function useTurnos (fecha: string, buscar: string){
    const [turnos, setTurnos] = useState<Turno[]>([]) //guarda la lista de los turnos
    const [loading, setLoading] = useState(true)

    const fetchTurnos = useCallback(async ()=>{ //trae los turnos del backend
        setLoading(true)
        try{
            const data = await getTurnosPorFecha(fecha, buscar || undefined)
            setTurnos(data)
        }catch{
            setTurnos([])
        }finally{
            setLoading(false)
        }
    }, [fecha, buscar])

    useEffect(()=> {fetchTurnos()}, [fetchTurnos])
    return{turnos, loading, refetch: fetchTurnos}
}