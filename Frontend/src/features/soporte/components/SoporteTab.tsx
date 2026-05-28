import { useEffect, useState } from 'react'
import { Plus, Paperclip } from 'lucide-react'
import { getSoportes, type Soporte } from '../services/soporteService'
import ResponderSoporteModal from './RespuestaSoporteModal'

const ESTADO_LABEL: Record<string, string> = {
    PENDIENTE: 'Pendiente',
    EN_PROCESO: 'En proceso',
    RESUELTO: 'Resuelto',
}

const ESTADO_BADGE: Record<string, string> = {
    PENDIENTE: 'bg-red-100 text-red-600',
    EN_PROCESO: 'bg-amber-100 text-amber-600',
    RESUELTO: 'bg-green-100 text-green-600',
}


// Color de fondo de cada tarjeta según su estado
const CARD_BG: Record<string, string> = {
    PENDIENTE: 'bg-red-50 border-red-100',
    EN_PROCESO: 'bg-amber-50 border-amber-100',
    RESUELTO: 'bg-green-50 border-green-100',
}

function SoporteTab() {
    const [tickets, setTickets] = useState<Soporte[]>([])
    const [loading, setLoading] = useState(true)
    const [selected, setSelected] = useState<number | null>(null) // ID del ticket abierto en el modal de respuesta

    const cargar = () => {
        setLoading(true)
        getSoportes().then(setTickets).finally(() => setLoading(false))
    }

    useEffect(() => { cargar() }, [])

    return (
        <>
            {loading && (
                <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="h-44 bg-white rounded-2xl border border-gray-100 animate-pulse" />
                    ))}
                </div>
            )}

            {!loading && tickets.length === 0 && (
                <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
                    No hay tickets de soporte
                </div>
            )}

            {!loading && tickets.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                    {tickets.map(t => (
                        <div key={t.id_soporte}
                            className={`rounded-2xl border shadow-sm p-4 flex flex-col gap-3 ${CARD_BG[t.estado] ?? 'bg-white border-gray-100'}`}>

                            <div className="flex items-center justify-between">
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${ESTADO_BADGE[t.estado]}`}>
                                    {ESTADO_LABEL[t.estado]}
                                </span>
                                <div className="flex items-center gap-1.5">
                                    {t.archivo_url && <Paperclip size={13} className="text-gray-400" />}
                                    {t.estado !== 'RESUELTO' && (
                                        <button
                                            onClick={() => setSelected(t.id_soporte)}
                                            className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 shadow-sm transition"
                                        >
                                            <Plus size={13} className="text-gray-500" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div>
                                <p className="text-sm font-bold text-gray-800 line-clamp-1">{t.asunto}</p>
                                <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{t.nombre ?? 'Anónimo'} · {t.correo}</p>
                            </div>

                            <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{t.descripcion}</p>

                            {t.respuesta && (
                                <div className="bg-white/60 rounded-xl px-3 py-2 text-xs text-gray-500 line-clamp-2">
                                    <span className="font-semibold text-gray-600">Respuesta: </span>{t.respuesta}
                                </div>
                            )}

                            <p className="text-xs text-gray-400 mt-auto">
                                {new Date(t.fecha_creacion).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {selected !== null && (
                <ResponderSoporteModal
                    id={selected}
                    onClose={() => setSelected(null)}
                    onSuccess={() => { setSelected(null); cargar() }}
                />
            )}
        </>
    )
}

export default SoporteTab
