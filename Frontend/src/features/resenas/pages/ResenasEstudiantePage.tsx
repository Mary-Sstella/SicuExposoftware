import { useEffect, useState } from 'react'
import { Star, Plus, X, MessageCircle } from 'lucide-react'
import { useAuthStore } from '../../auth/store/authStore'
import { getResenasPublicas, getMisResenas, crearResena } from '../services/resenaService'

interface Resena {
    id_rese_a: number
    calificacion: number
    texto: string
    fecha_creacion: string
    estudiante?: { nombres: string; apellidos: string }
}

const Estrellas = ({ valor, onClick }: { valor: number; onClick?: (v: number) => void }) => (
    <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(i => (
            <Star key={i} size={14} onClick={() => onClick?.(i)}
                className={`${onClick ? 'cursor-pointer' : ''} ${i <= valor ? 'text-violet-500 fill-violet-500' : 'text-gray-200 fill-gray-200'}`}
            />
        ))}
    </div>
)

const formatFecha = (fecha: string) =>
    new Date(fecha).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })

function ResenasEstudiantePage() {
    const { id_estudiante } = useAuthStore()
    const [publicas, setPublicas] = useState<Resena[]>([])
    const [misResenas, setMisResenas] = useState<Resena[]>([])
    const [loading, setLoading] = useState(true)
    const [modalOpen, setModalOpen] = useState(false)
    const [calificacion, setCalificacion] = useState(0)
    const [texto, setTexto] = useState('')
    const [enviando, setEnviando] = useState(false)

    const cargar = () => {
        Promise.all([
            getResenasPublicas(),
            id_estudiante ? getMisResenas() : Promise.resolve([])
        ]).then(([pub, mis]) => {
            setPublicas(pub)
            setMisResenas(mis)
        }).finally(() => setLoading(false))
    }

    useEffect(() => { cargar() }, [id_estudiante])

    const handleEnviar = async () => {
        if (calificacion === 0 || texto.trim() === '') return
        setEnviando(true)
        try {
            await crearResena(calificacion, texto)
            setModalOpen(false)
            setCalificacion(0)
            setTexto('')
            cargar()
        } finally {
            setEnviando(false)
        }
    }

    return (
        <div className="p-4 md:p-6 flex flex-col md:flex-row gap-4 md:gap-5 items-start">

            {/* Reseñas públicas */}
            <div className="flex-1 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                    <MessageCircle size={18} className="text-violet-500" />
                    <h2 className="text-sm font-bold text-gray-700 dark:text-gray-200">Reseñas del comedor</h2>
                    <span className="text-xs text-gray-400 dark:text-gray-500">({publicas.length})</span>
                </div>

                {loading && [1, 2, 3].map(i => (
                    <div key={i} className="flex gap-3 animate-pulse">
                        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex-shrink-0" />
                        <div className="flex-1 h-24 bg-gray-100 dark:bg-gray-800 rounded-2xl" />
                    </div>
                ))}

                {!loading && publicas.length === 0 && (
                    <p className="text-sm text-gray-400 dark:text-gray-500">Aún no hay reseñas públicas.</p>
                )}

                {!loading && publicas.map(r => (
                    <div key={r.id_rese_a} className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-violet-200 dark:bg-violet-900/50 flex items-center justify-center flex-shrink-0 text-sm font-bold text-violet-700 dark:text-violet-300">
                            {r.estudiante?.nombres[0]}{r.estudiante?.apellidos[0]}
                        </div>
                        <div className="relative bg-violet-50 dark:bg-violet-900/20 border border-violet-100 dark:border-violet-900/40 rounded-2xl rounded-tl-sm p-3 flex-1">
                            <div className="absolute -left-2 top-3 w-3 h-3 bg-violet-50 dark:bg-violet-900/20 border-l border-b border-violet-100 dark:border-violet-900/40 rotate-45" />
                            <div className="flex items-center justify-between mb-1">
                                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                    {r.estudiante?.nombres} {r.estudiante?.apellidos}
                                </p>
                                <Estrellas valor={r.calificacion} />
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{r.texto}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{formatFecha(r.fecha_creacion)}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Mis reseñas */}
            <div className="w-full md:w-72 md:flex-shrink-0 flex flex-col gap-3">
                <button onClick={() => setModalOpen(true)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-violet-600 to-purple-500 text-white rounded-xl text-sm font-semibold hover:opacity-90 transition">
                    <Plus size={16} /> Dejar reseña
                </button>

                <div className="flex items-center gap-2 mt-1">
                    <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200">Mis reseñas</h3>
                    <span className="text-xs text-gray-400 dark:text-gray-500">({misResenas.length})</span>
                </div>

                {!loading && misResenas.length === 0 && (
                    <p className="text-xs text-gray-400 dark:text-gray-500">Aún no has dejado ninguna reseña.</p>
                )}

                {misResenas.map(r => (
                    <div key={r.id_rese_a} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-3 flex flex-col gap-1 shadow-sm">
                        <Estrellas valor={r.calificacion} />
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{r.texto}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">{formatFecha(r.fecha_creacion)}</p>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 w-full max-w-md flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-bold text-gray-800 dark:text-white">Dejar una reseña</h3>
                            <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition">
                                <X size={18} />
                            </button>
                        </div>

                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Calificación</p>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <Star key={i} size={28} onClick={() => setCalificacion(i)}
                                        className={`cursor-pointer transition-colors ${i <= calificacion ? 'text-violet-500 fill-violet-500' : 'text-gray-200 dark:text-gray-700 fill-gray-200 dark:fill-gray-700'}`}
                                    />
                                ))}
                            </div>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Haz clic para calificar</p>
                        </div>

                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Comentario</p>
                            <textarea value={texto} onChange={e => setTexto(e.target.value)}
                                placeholder="Cuéntanos tu experiencia en el comedor..."
                                rows={4}
                                className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl px-3 py-2 text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-600 resize-none focus:outline-none focus:ring-2 focus:ring-violet-300"
                            />
                        </div>

                        <button onClick={handleEnviar}
                            disabled={calificacion === 0 || texto.trim() === '' || enviando}
                            className="w-full py-2.5 bg-gradient-to-r from-violet-600 to-purple-500 text-white rounded-xl text-sm font-semibold hover:opacity-90 transition disabled:opacity-50">
                            {enviando ? 'Enviando...' : 'Enviar reseña'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ResenasEstudiantePage
