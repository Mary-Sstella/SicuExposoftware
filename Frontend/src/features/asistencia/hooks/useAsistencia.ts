import { useEffect, useState } from "react"
import { getAsistenciasHoy } from "../services/asistenciaService"



interface Asistencia {
    hora_reserva: string
    nombres: string
    apellidos: string
    numero_identificacion: string
    carrera: string
    turno: number | null
    metodo: 'HUELLA' | 'MANUAL' | null
    estado: 'PENDIENTE' | 'CONFIRMADO'
}

export function useAsistencia(){
    const [asistencias, setAsistencias] = useState<Asistencia[]>([])
    const [loading, setLoading] = useState(true)

    const fetchData = async () =>{ //carga las asistencias del dia cuando se abre la pag por primera vez
        try{
            const data = await getAsistenciasHoy()
            setAsistencias(data)
        }finally{
            setLoading(false)
        }
    }

    useEffect(()=>{ //ejecuta el codigo cuando el componente se monta o se cambia algo
        fetchData() 
        const intervalo = setInterval(fetchData, 10000) //se crea un intervalo y cada 10seg llama a fechtData para actualizar
        return () => clearInterval(intervalo) //cuando se abandona la pag se cancela el intervalo para que deje de actualizar en timpo real
    },[])

    return{asistencias, loading, refetch: fetchData}
}