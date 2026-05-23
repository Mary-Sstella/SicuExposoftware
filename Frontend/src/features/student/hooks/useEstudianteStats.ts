import { useEffect, useState } from 'react'
import { useAuthStore } from '../../auth/store/authStore'
import { getEstudianteStats } from '../services/estudianteService'

interface Stats {
    inasistencias: number
    almuerzos_consumidos: number
    pagos_aprobados: number
    pagos_rechazados: number
}

export function useEstudianteStats() {
    const { id_estudiante } = useAuthStore()
    const [stats, setStats] = useState<Stats | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!id_estudiante) {
            setLoading(false)
            return
        }
        getEstudianteStats(id_estudiante)
            .then(setStats)
            .catch((err) => console.error('[useEstudianteStats] error:', err))
            .finally(() => setLoading(false))
    }, [id_estudiante])

    return { stats, loading }
}
