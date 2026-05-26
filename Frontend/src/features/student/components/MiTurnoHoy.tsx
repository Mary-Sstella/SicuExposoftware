import { useState } from 'react'
import { CheckCircle2, XCircle, Clock, CalendarDays, QrCode } from 'lucide-react'
import { useMisTurnos } from '../hooks/useMisTurnos'
import QRModal from './QRModal'

function MiTurnoHoy() {
    const { turno, loading } = useMisTurnos()
    const [mostrarQR, setMostrarQR] = useState(false)

    if (loading) return (
        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-4 animate-pulse flex flex-col gap-3">
            <div className="h-4 bg-gray-100 rounded w-1/4" />
            <div className="h-16 bg-gray-100 rounded" />
        </div>
    )

    if (!turno || !turno.numero_turno) return (
        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5 flex flex-col gap-4 h-full">
            <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-gray-800">Mi turno de hoy</p>
                <div className="w-2 h-2 rounded-full bg-gray-200" />
            </div>
            <div className="flex flex-col items-center justify-center gap-3 flex-1 py-2">
                <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center">
                    <CalendarDays size={24} className="text-gray-300" />
                </div>
                <div className="text-center">
                    <p className="text-xs font-black text-gray-500 tracking-wide">SIN RESERVAR TODAVÍA</p>
                    <p className="text-xs text-gray-400 mt-1">No tienes turno asignado para hoy</p>
                </div>
            </div>
        </div>
    )

    const llego = turno.estado === 'ENTREGADA'
    const ausente = turno.estado === 'AUSENTE'

    return (
        <>
            <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-gray-800">Mi turno de hoy</p>
                    <div className={`w-2 h-2 rounded-full ${llego ? 'bg-green-400' : ausente ? 'bg-red-400' : 'bg-amber-400'}`} />
                </div>

                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-400 flex flex-col items-center justify-center flex-shrink-0 shadow-md">
                        <span className="text-[9px] font-bold text-white/70 uppercase tracking-wide">Turno</span>
                        <span className="text-2xl font-black text-white leading-none">#{turno.numero_turno}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                            <Clock size={12} />
                            <span className="font-medium">{turno.hora_inicio} – {turno.hora_fin}</span>
                        </div>
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl w-fit ${llego ? 'bg-green-50' : ausente ? 'bg-red-50' : 'bg-amber-50'}`}>
                            {llego ? <CheckCircle2 size={13} className="text-green-500" />
                                : ausente ? <XCircle size={13} className="text-red-400" />
                                : <Clock size={13} className="text-amber-400" />}
                            <span className={`text-xs font-bold ${llego ? 'text-green-600' : ausente ? 'text-red-500' : 'text-amber-600'}`}>
                                {llego ? 'Asistencia confirmada' : ausente ? 'Ausente' : 'Pendiente de asistir'}
                            </span>
                        </div>
                    </div>
                </div>

                {!llego && !ausente && turno.id_reserva && (
                    <button
                        onClick={() => setMostrarQR(true)}
                        className="flex items-center justify-center gap-2 w-full py-2 rounded-xl border-2 border-violet-200 text-violet-600 text-xs font-semibold hover:bg-violet-50 transition"
                    >
                        <QrCode size={14} /> Ver mi QR
                    </button>
                )}
            </div>

            {mostrarQR && turno.id_reserva && (
                <QRModal id_reserva={turno.id_reserva} onClose={() => setMostrarQR(false)} />
            )}
        </>
    )
}

export default MiTurnoHoy
