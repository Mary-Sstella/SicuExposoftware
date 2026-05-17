import { useEstadisticas } from '../hooks/useEstadisticas'
import CarreraChart from '../components/CarreraChart'
import AsistenciaMensualChart from '../components/AsistenciaMensualChart'
import { BarChart2 } from 'lucide-react'

function EstadisticasPage() {
    const { carreras, asistencia, loading } = useEstadisticas()

    if (loading) return <div className="p-8 text-gray-400 text-sm">Cargando estadísticas...</div>

    return (
        <div className="flex-1 p-8 overflow-y-auto bg-gray-50">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-purple-400 rounded-2xl flex items-center justify-center shadow-md">
                    <BarChart2 size={26} className="text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Estadísticas</h1>
                    <p className="text-sm text-gray-400">Resumen general del sistema</p>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-6 items-start">
                <CarreraChart data={carreras} />
                <AsistenciaMensualChart data={asistencia} />
            </div>
        </div>
    )
}

export default EstadisticasPage
