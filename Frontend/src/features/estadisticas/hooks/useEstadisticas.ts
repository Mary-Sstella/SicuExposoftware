import { useEffect, useState } from 'react'
import { getCarreras, getAsistenciaMensual } from '../services/estadisticasService'

export function useEstadisticas() {
    const [carreras, setCarreras] = useState<{ carrera: string; total: number }[]>([])
    const [loading, setLoading] = useState(true)
    const [asistencia, setAsistencia] = useState<{ dia: string; presentes: number; ausentes: number }[]>([])

    useEffect(() => {
        const fetch = async () => {
            try {
                const data = await getCarreras()
                setCarreras(data)
                const asistenciaData = await getAsistenciaMensual()
                setAsistencia(asistenciaData)
            } finally {
                setLoading(false)
            }
        }
        fetch()
    }, [])

    return { carreras,asistencia,loading }
}