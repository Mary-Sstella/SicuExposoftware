import { useEstadisticas } from '../hooks/useEstadisticas'
import CarreraChart from '../components/CarreraChart'
import AsistenciaMensualChart from '../components/AsistenciaMensualChart'

function EstadisticasPage() {
    const { carreras, asistencia, loading } = useEstadisticas()

    if (loading) return <div className="p-8 text-gray-400 text-sm">Cargando estadísticas...</div>

    return (
        <div className="flex-1 p-8 overflow-y-auto bg-gray-50">
            <div className="mb-6">
                <h2 className="text-base font-semibold text-gray-700">Estadísticas</h2>
                <p className="text-xs text-gray-400">Resumen general del sistema</p>
            </div>
            <div className="grid grid-cols-2 gap-6">
                <CarreraChart data={carreras} />
                <AsistenciaMensualChart data={asistencia} />
            </div>
        </div>
    )
}

export default EstadisticasPage