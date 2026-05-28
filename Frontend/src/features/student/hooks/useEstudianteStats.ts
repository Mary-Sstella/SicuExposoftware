import { useEffect, useState } from 'react'
import { useAuthStore } from '../../auth/store/authStore'
import { getEstudianteStats } from '../services/estudianteService'

//lo que devuelve el backend
interface Stats {
    inasistencias: number
    almuerzos_consumidos: number
    pagos_aprobados: number
    pagos_rechazados: number
}

export function useEstudianteStats() {
    //Obtiene el ID del estudiante autenticado desde el store global(objeto de estado compartido)
    const { id_estudiante } = useAuthStore()
    //estados de las estdisticas null mientras se estan cargando los datos
    const [stats, setStats] = useState<Stats | null>(null)
    //peticion del backend en curso
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        //si no hya sesion activa no se hace la peticion
        if (!id_estudiante) {
            setLoading(false)
            return
        }
        
        //Llama al servicio que consulta las stats del estudiante en el backend
        getEstudianteStats(id_estudiante)
            .then(setStats) //guarda los stats en el estado
            .catch((err) => console.error('[useEstudianteStats] error:', err))
            .finally(() => setLoading(false))
    }, [id_estudiante])// Se vuelve a ejecutar si cambia el estudiante autenticado

    return { stats, loading }
}
