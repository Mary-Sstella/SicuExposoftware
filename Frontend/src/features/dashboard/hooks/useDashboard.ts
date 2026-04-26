import { useEffect, useState } from 'react'
import { getDashboardSummary } from '../services/dashboardService'
import api from '../../../shared/api/axios'

interface Summary {
  total_estudiantes: number
  estudiantes_activos: number
  estudiantes_inactivos: number
  asistencias_hoy: number
  pagos_pendientes: number
}

interface AsistenciaDia {
  dia: string
  presentes: number
  ausentes: number
}

interface Actividad {
  id_actividad: number
  tipo: string
  descripcion: string
  fecha: string
  username: string
}

export function useDashboard() {
  const [summary, setSummary] = useState<Summary | null>(null)
  const [loading, setLoading] = useState(true)
  const [asistenciaSemanal, setAsistenciaSemanal] = useState<AsistenciaDia[]>([])
  const [actividades, setActividades] = useState<Actividad[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDashboardSummary()
        setSummary(data)
        const asistencia = await api.get('/dashboard/asistencia-semanal')
        setAsistenciaSemanal(asistencia.data)
        const acts = await api.get('/dashboard/actividades-recientes')
        setActividades(acts.data)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return { summary, loading, asistenciaSemanal, actividades }
}
