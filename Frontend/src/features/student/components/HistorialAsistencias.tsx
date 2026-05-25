import { useEffect, useState } from 'react'
import { CheckCircle2, XCircle, Clock, AlertCircle, History } from 'lucide-react'
import { useAuthStore } from '../../auth/store/authStore'
import { getHistorialEstudiante } from '../services/estudianteService'

interface Registro {
    fecha: string
    hora_inicio: string
    hora_fin: string
    numero_turno: number
    estado: string
}

const formatFecha = (fecha: string) => {
    const soloFecha = fecha.split('T')[0]
    return new Date(soloFecha + 'T12:00:00').toLocaleDateString('es-CO', {
        weekday: 'short', day: 'numeric', month: 'short'
    })
}

function HistorialAsistencias() {
    const { id_estudiante } = useAuthStore()
    const [historial, setHistorial] = useState<Registro[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!id_estudiante) return
        getHistorialEstudiante(id_estudiante)
            .then(setHistorial)
            .finally(() => setLoading(false))
    }, [id_estudiante])

    return (
        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <History size={16} className="text-violet-500" />
                    <h3 className="text-sm font-bold text-gray-800">Historial de asistencias</h3>
                </div>
                {historial.length > 0 && (
                    <span className="text-xs text-gray-400">{historial.length} registros</span>
                )}
            </div>

            {loading && (
                <div className="flex flex-col gap-2 animate-pulse">
                    {[1, 2, 3].map(i => <div key={i} className="h-12 bg-gray-50 rounded-xl" />)}
                </div>
            )}

            {!loading && historial.length === 0 && (
                <div className="flex flex-col items-center gap-2 text-gray-400 py-4">
                    <AlertCircle size={20} className="text-gray-200" />
                    <span className="text-xs">Sin registros de asistencia aún</span>
                </div>
            )}

            {!loading && historial.length > 0 && (
                <div className="flex flex-col gap-1 max-h-44 overflow-y-auto pr-0.5">
                    {historial.map((r, i) => {
                        const entregada = r.estado === 'ENTREGADA'
                        const ausente = r.estado === 'AUSENTE'
                        return (
                            <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition">
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                    entregada ? 'bg-green-50' : ausente ? 'bg-red-50' : 'bg-amber-50'
                                }`}>
                                    {entregada
                                        ? <CheckCircle2 size={15} className="text-green-500" />
                                        : ausente
                                        ? <XCircle size={15} className="text-red-400" />
                                        : <Clock size={15} className="text-amber-400" />
                                    }
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-gray-700 capitalize">{formatFecha(r.fecha)}</p>
                                    <div className="flex items-center gap-1 text-gray-400 text-[10px]">
                                        <Clock size={9} />
                                        <span>{r.hora_inicio} – {r.hora_fin}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1.5 flex-shrink-0">
                                    <span className="text-[10px] font-bold text-violet-500 bg-violet-50 px-2 py-0.5 rounded-full">
                                        #{r.numero_turno}
                                    </span>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                        entregada ? 'bg-green-100 text-green-600'
                                        : ausente ? 'bg-red-100 text-red-500'
                                        : 'bg-amber-100 text-amber-600'
                                    }`}>
                                        {entregada ? 'Asistió' : ausente ? 'Ausente' : 'Pendiente'}
                                    </span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default HistorialAsistencias
