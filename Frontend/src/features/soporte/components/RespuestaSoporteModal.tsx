import { useEffect, useState } from 'react'
import { X, Paperclip, Loader2, ExternalLink, AlertCircle } from 'lucide-react'
import { getSoporteById, responderSoporte, type SoporteDetalle } from '../services/soporteService'


// Props que recibe el modal: ID del ticket, función para cerrar y función al enviar exitoso
interface Props {
    id: number
    onClose: ()=> void
    onSuccess: () => void
}

// Clases de color para el badge de estado del ticket
const ESTADO_STYLE: Record<string, string>={
    PENDIENTE: 'bg-red-100 text-red-600',
    EN_PROCESO: 'bg-amber-100 text-amber-600',
    RESUELTO: 'bg-green-100 text-green-600',
}


function ResponderSoporteModal({ id, onClose, onSuccess }: Props) {
    const [ticket, setTicket] = useState<SoporteDetalle | null>(null) // detalle completo del ticket (con URL firmada del adjunto)
    const [respuesta, setRespuesta] = useState('')
    const [enviando, setEnviando] = useState(false)
    const [error, setError] = useState<string | null>(null)

     // al abrir el modal carga el detalle del ticket para mostrar toda la info
    useEffect(() => {
        getSoporteById(id).then(setTicket)
    }, [id])

    const handleEnviar = async () => {
        if (!respuesta.trim() || enviando) return
        setEnviando(true)
        setError(null)
        try {
            await responderSoporte(id, respuesta)
            onSuccess()
        } catch {
            setError('No se pudo enviar la respuesta')
        } finally {
            setEnviando(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-base font-bold text-gray-800">Responder ticket</h2>
                    <button onClick={onClose} className="text-gray-300 hover:text-gray-500 transition">
                        <X size={20} />
                    </button>
                </div>

                {!ticket ? (
                    <div className="flex items-center justify-center h-40">
                        <Loader2 size={20} className="animate-spin text-violet-400" />
                    </div>
                ) : (
                    <div className="p-6 flex flex-col gap-5">
                        <div className="bg-gray-50 rounded-2xl p-4 flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Ticket #{ticket.id_soporte}</span>
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${ESTADO_STYLE[ticket.estado]}`}>
                                    {ticket.estado}
                                </span>
                            </div>
                            <p className="text-sm font-bold text-gray-800">{ticket.asunto}</p>
                            <p className="text-xs text-gray-500">{ticket.nombre} · {ticket.correo}</p>
                            <p className="text-sm text-gray-600 leading-relaxed mt-1">{ticket.descripcion}</p>
                            {ticket.archivo_firmada_url && (
                                <a href={ticket.archivo_firmada_url} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 text-xs text-violet-500 hover:text-violet-700 mt-1">
                                    <Paperclip size={12} />
                                    Ver archivo adjunto
                                    <ExternalLink size={11} />
                                </a>
                            )}
                        </div>

                        <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Tu respuesta</p>
                            <textarea
                                value={respuesta}
                                onChange={e => setRespuesta(e.target.value)}
                                placeholder="Escribe la respuesta para el estudiante..."
                                rows={5}
                                className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-transparent"
                            />
                            <p className="text-xs text-gray-400 mt-1">
                                Se enviará al correo: <span className="font-medium text-gray-600">{ticket.correo}</span>
                            </p>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 px-3 py-2 bg-red-50 rounded-xl text-xs text-red-500">
                                <AlertCircle size={13} /> {error}
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button onClick={onClose} disabled={enviando}
                                className="flex-1 py-2.5 border border-gray-200 text-gray-500 rounded-xl text-sm font-semibold hover:bg-gray-50 transition disabled:opacity-50">
                                Cancelar
                            </button>
                            <button onClick={handleEnviar} disabled={!respuesta.trim() || enviando}
                                className="flex-1 py-2.5 bg-gradient-to-br from-violet-500 to-purple-400 text-white rounded-xl text-sm font-semibold hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                {enviando ? <><Loader2 size={15} className="animate-spin" /> Enviando...</> : 'Enviar respuesta'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ResponderSoporteModal

