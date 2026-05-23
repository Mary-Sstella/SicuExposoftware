import { CheckCircle2, Clock, CalendarDays } from 'lucide-react'
import { useMisTurnos } from '../hooks/useMisTurnos'

function MiTurnoHoy() {
    const { turno, loading } = useMisTurnos()

    if (loading) return (
        <div className="bg-white border border-gray-700 shadow-md rounded-2xl p-4 animate-pulse flex flex-col gap-3">
            <div className="h-4 bg-gray-100 rounded w-1/4" />
            <div className="h-16 bg-gray-100 rounded" />
        </div>
    )

    if (!turno || !turno.numero_turno) return (
        <div className="bg-white border border-gray-700 shadow-md rounded-2xl p-4 flex flex-col gap-3 h-full">
            <p className="text-sm font-bold text-gray-700">Mi turno de hoy</p>
            <div className="flex flex-col items-center justify-center gap-3 flex-1">
                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                    <CalendarDays size={26} className="text-gray-300" />
                </div>
                <div className="text-center">
                    <p className="text-sm font-semibold text-gray-500">No tienes turno asignado para hoy</p>
                    <p className="text-xs text-gray-400 mt-0.5">Cuando tengas un turno aparecerá aquí<br/>con el número y los detalles.</p>
                </div>
            </div>
        </div>
    )

    const llego = turno.estado === 'ENTREGADA'

    return (
        <div className="bg-white border border-gray-700 shadow-md rounded-2xl p-4 flex flex-col gap-3">
            <p className="text-sm font-bold text-gray-700">Mi turno de hoy</p>
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-violet-100 flex flex-col items-center justify-center flex-shrink-0">
                    <span className="text-xs font-semibold text-violet-400">Turno</span>
                    <span className="text-2xl font-black text-violet-600">#{turno.numero_turno}</span>
                </div>
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1 text-gray-500 text-xs">
                        <Clock size={12} />
                        <span>{turno.hora_inicio} – {turno.hora_fin}</span>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl w-fit ${llego ? 'bg-green-50' : 'bg-amber-50'}`}>
                        <CheckCircle2 size={14} className={llego ? 'text-green-500' : 'text-amber-400'} />
                        <span className={`text-xs font-semibold ${llego ? 'text-green-600' : 'text-amber-600'}`}>
                            {llego ? 'Asistencia confirmada' : 'Asistencia pendiente'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MiTurnoHoy
