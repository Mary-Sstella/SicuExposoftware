import { useEffect, useState } from 'react'
import { getDashboardSummary } from '../services/dashboardService'
// Hook que obtiene el resumen del dashboard desde el backend

interface Summary {
  total_estudiantes: number
  estudiantes_activos: number
  estudiantes_inactivos: number
  pagos_pendientes: number
}

export function useDashboard() {
  const [summary, setSummary] = useState<Summary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    {/*promeda*/}
  const fetchData = async () => {
    try {
      const data = await getDashboardSummary()
      setSummary(data)
    } finally {
      setLoading(false)
    }
  }
  fetchData()
}, [])


  return { summary, loading }
}
