import { useEffect, useState } from 'react'
import { getCarreras, getAsistenciaMensual, getRangosPopulares } from '../services/estadisticasService'

export function useEstadisticas() {
    const [carreras, setCarreras] = useState<{ carrera: string; total: number }[]>([])
    const [asistencia, setAsistencia] = useState<{ dia: string; presentes: number; ausentes: number }[]>([])
    const [rangos, setRangos] = useState<{ hora_inicio: string; hora_fin: string; total_reservas: number }[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetch = async () => {
            try {
                const [data, asistenciaData, rangosData] = await Promise.all([
                    getCarreras(),
                    getAsistenciaMensual(),
                    getRangosPopulares()
                ])
                setCarreras(data)
                setAsistencia(asistenciaData)
                setRangos(rangosData)
            } finally {
                setLoading(false)
            }
        }
        fetch()
    }, [])

    return { carreras, asistencia, rangos, loading }
}
