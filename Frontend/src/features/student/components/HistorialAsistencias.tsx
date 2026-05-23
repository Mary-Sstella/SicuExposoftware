import { useEffect, useState } from 'react'
import { CheckCircle2, Clock, AlertCircle, History } from 'lucide-react'
import { useAuthStore } from '../../auth/store/authStore'
import { getHistorialEstudiante } from '../services/estudianteService'


interface Registro{
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



const EstadoBadge = ({ estado }: { estado: string }) => {
    const estilos: Record<string, string> = {
        ENTREGADA: 'bg-green-100 text-green-600',
        PENDIENTE: 'bg-amber-100 text-amber-600',
        AUSENTE: 'bg-red-100 text-red-500',
    }
    return (
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${estilos[estado] ?? 'bg-gray-100 text-gray-500'}`}>
            {estado}
        </span>
    )
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
        <div className="bg-white border border-gray-700 shadow-md rounded-2xl p-3 flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <History size={18} className="text-violet-500" />
                <h3 className="text-sm font-bold text-gray-700">Historial de asistencias</h3>
            </div>

            {loading && (
                <div className="flex flex-col gap-2 animate-pulse">
                    {[1,2,3].map(i => <div key={i} className="h-10 bg-gray-100 rounded-xl" />)}
                </div>
            )}

            {!loading && historial.length === 0 && (
                <div className="flex items-center gap-2 text-gray-400 text-xs py-2">
                    <AlertCircle size={14} />
                    <span>Sin registros de asistencia aún</span>
                </div>
            )}

            {!loading && historial.length > 0 && (
                <div className="flex flex-col gap-2 max-h-40 overflow-y-auto pr-1">
                    {historial.map((r, i) => (
                        <div key={i} className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                    r.estado === 'ENTREGADA' ? 'bg-green-100' : r.estado === 'AUSENTE' ? 'bg-red-100' : 'bg-amber-100'
                                }`}>
                                    <CheckCircle2 size={14} className={
                                        r.estado === 'ENTREGADA' ? 'text-green-500' : r.estado === 'AUSENTE' ? 'text-red-400' : 'text-amber-400'
                                    } />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-700 capitalize">{formatFecha(r.fecha)}</p>
                                    <div className="flex items-center gap-1 text-gray-400 text-xs">
                                        <Clock size={10} />
                                        <span>{r.hora_inicio} – {r.hora_fin} · Turno #{r.numero_turno}</span>
                                    </div>
                                </div>
                            </div>
                            <EstadoBadge estado={r.estado} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default HistorialAsistencias