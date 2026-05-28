import { useState } from 'react'
import { Download, Loader2 } from 'lucide-react'
import { useEstadisticas } from '../hooks/useEstadisticas'
import CarreraChart from '../components/CarreraChart'
import AsistenciaMensualChart from '../components/AsistenciaMensualChart'
import TurnosChart from '../components/TurnosChart'
import { exportarEstadisticas } from '../services/estadisticasService'

function EstadisticasPage() {
    const { carreras, asistencia, rangos, loading } = useEstadisticas()
    const [exportando, setExportando] = useState(false)

    const handleExportar = async () => {
        setExportando(true)
        try {
            await exportarEstadisticas()
        } finally {
            setExportando(false)
        }
    }

    if (loading) return (
        <div className="flex-1 flex items-center justify-center bg-slate-100">
            <p className="text-sm text-gray-400">Cargando estadísticas...</p>
        </div>
    )

    return (
        <div className="flex-1 p-8 overflow-y-auto bg-slate-100">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Estadísticas</h1>
                <button
                    onClick={handleExportar}
                    disabled={exportando}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-br from-violet-500 to-purple-400 text-white text-sm font-semibold rounded-2xl hover:opacity-90 transition disabled:opacity-50 shadow-md"
                >
                    {exportando
                        ? <><Loader2 size={15} className="animate-spin" /> Exportando...</>
                        : <><Download size={15} /> Exportar Excel</>
                    }
                </button>
            </div>
            <div className="grid grid-cols-2 gap-6 items-start">
                <TurnosChart data={rangos} />
                <AsistenciaMensualChart data={asistencia} />
                <CarreraChart data={carreras} />
            </div>
        </div>
    )
}

export default EstadisticasPage
