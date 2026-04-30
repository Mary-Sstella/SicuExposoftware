
import { useCallback, useEffect, useState } from "react"
import { getConfiguracion } from "../services/turnosService"

//la configuaracion son los rangos horarios que se configuraron en la BD
export interface Rango {
    id_configuracion: number
    hora_inicio: string
    hora_fin: string
    capacidad_maxima: number
    activo: boolean
}

export function useConfiguracion(){
    const[rangos, setRangos] = useState<Rango[]>([])
    const [loading, setLoading] = useState(true)

    const fetchRangos = useCallback(async()=>{
        setLoading(true)
        try{
            const data = await getConfiguracion()
            setRangos(data)
        }catch{
            setRangos([])
        }finally{
            setLoading(false)
        }
    }, [])

    useEffect(()=> {fetchRangos()}, [fetchRangos])
    return {rangos, loading, refetch: fetchRangos}
}