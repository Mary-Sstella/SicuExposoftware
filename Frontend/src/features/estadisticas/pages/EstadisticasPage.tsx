import { useEstadisticas } from '../hooks/useEstadisticas'
import CarreraChart from '../components/CarreraChart'
import AsistenciaMensualChart from '../components/AsistenciaMensualChart'

function EstadisticasPage() {
    const { carreras, asistencia, loading } = useEstadisticas()

    if (loading) return (
        <div className="flex-1 flex items-center justify-center bg-slate-100">
            <p className="text-sm text-gray-400">Cargando estadísticas...</p>
        </div>
    )

    return (
        <div className="flex-1 p-8 overflow-y-auto bg-slate-100">
            <div className="mb-6">
            </div>
            <div className="grid grid-cols-2 gap-6 items-start">
                <AsistenciaMensualChart data={asistencia} />
                <CarreraChart data={carreras} />
            </div>
        </div>
    )
}

export default EstadisticasPage