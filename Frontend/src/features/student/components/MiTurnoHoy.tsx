import { AlertCircle, CheckCircle2, Clock, Hash } from 'lucide-react'
import { useMisTurnos } from '../hooks/useMisTurnos'

function MiTurnoHoy() {
    const { turno, loading } = useMisTurnos()

    if (loading) return (
        <div className="bg-white border border-gray-300 shadow-md rounded-2xl p-6 animate-pulse flex flex-col gap-3">
            <div className="h-4 bg-gray-100 rounded w-1/4" />
            <div className="h-16 bg-gray-100 rounded" />
        </div>
    )

    if (!turno || !turno.numero_turno) return (
        <div className="bg-white border border-gray-300 shadow-md rounded-2xl p-6 flex items-center gap-3">
            <AlertCircle size={20} className="text-gray-300 flex-shrink-0" />
            <p className="text-sm text-gray-400">No tienes turno asignado para hoy</p>
        </div>
    )

    const llego = turno.estado === 'PRESENTE'

    return (
        <div className="bg-white border border-gray-300 shadow-md rounded-2xl p-6 flex flex-col gap-4">
            <h3 className="text-sm font-bold text-gray-700">Mi turno de hoy</h3>
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-violet-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-black text-violet-600">#{turno.numero_turno}</span>
                </div>
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1 text-gray-500 text-xs">
                        <Clock size={12} />
                        <span>{turno.hora_inicio} – {turno.hora_fin}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500 text-xs">
                        <Hash size={12} />
                        <span>Turno número {turno.numero_turno}</span>
                    </div>
                </div>
            </div>
            <div className={`flex items-center gap-2 px-3 py-2 rounded-xl ${llego ? 'bg-green-50' : 'bg-amber-50'}`}>
                <CheckCircle2 size={16} className={llego ? 'text-green-500' : 'text-amber-400'} />
                <span className={`text-xs font-semibold ${llego ? 'text-green-600' : 'text-amber-600'}`}>
                    {llego ? 'Asistencia confirmada' : 'Asistencia pendiente'}
                </span>
            </div>
        </div>
    )
}

export default MiTurnoHoy
