import { useEffect, useState } from 'react'
import { Star, MessageSquare, LifeBuoy } from 'lucide-react'
import { getResenas, togglePublicado } from '../services/resenaService'
import SoporteTab from '../../soporte/components/SoporteTab'

interface Resena {
    id_rese_a: number
    calificacion: number
    texto: string
    fecha_creacion: string
    publicado: boolean
    estudiante: { nombres: string; apellidos: string }
}

const Estrellas = ({ valor }: { valor: number }) => (
    <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(i => (
            <Star key={i} size={14} className={i <= valor ? 'text-violet-500 fill-violet-500' : 'text-gray-200 fill-gray-200'} />
        ))}
    </div>
)

const Toggle = ({ activo, onChange }: { activo: boolean; onChange: (v: boolean) => void }) => (
    <button
        onClick={() => onChange(!activo)}
        className={`relative w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none ${activo ? 'bg-violet-500' : 'bg-gray-200'}`}
    >
        <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${activo ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
)

function ResenasPage() {
    const [tab, setTab] = useState<'resenas' | 'soporte'>('resenas')
    const [resenas, setResenas] = useState<Resena[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getResenas()
            .then(setResenas)
            .finally(() => setLoading(false))
    }, [])

    const handleToggle = async (id: number, publicado: boolean) => {
        await togglePublicado(id, publicado)
        setResenas(prev => prev.map(r => r.id_rese_a === id ? { ...r, publicado } : r))
    }

    const publicas = resenas.filter(r => r.publicado).length

    return (
        <div className="p-8 flex flex-col gap-6">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
                    <MessageSquare size={20} className="text-violet-500" />
                </div>
                <div>
                    <h1 className="text-lg font-bold text-gray-800">Buzón</h1>
                    <p className="text-xs text-gray-400">Reseñas y tickets de soporte</p>
                </div>
            </div>

            <div className="flex gap-2">
                <button
                    onClick={() => setTab('resenas')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${tab === 'resenas' ? 'bg-violet-500 text-white shadow-sm' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                >
                    <Star size={14} /> Reseñas
                    {resenas.length > 0 && (
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === 'resenas' ? 'bg-white/20' : 'bg-gray-200 text-gray-500'}`}>
                            {resenas.length}
                        </span>
                    )}
                </button>
                <button
                    onClick={() => setTab('soporte')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${tab === 'soporte' ? 'bg-violet-500 text-white shadow-sm' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                >
                    <LifeBuoy size={14} /> Soporte
                </button>
            </div>

            {tab === 'resenas' ? (
                <>
                    <p className="text-xs text-gray-400 -mt-2">{resenas.length} reseñas · {publicas} públicas</p>

                    {loading && (
                        <div className="grid grid-cols-3 gap-4">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="h-44 bg-white rounded-2xl border border-gray-100 animate-pulse" />
                            ))}
                        </div>
                    )}

                    {!loading && resenas.length === 0 && (
                        <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
                            No hay reseñas aún
                        </div>
                    )}

                    {!loading && resenas.length > 0 && (
                        <div className="grid grid-cols-3 gap-4">
                            {resenas.map(r => (
                                <div key={r.id_rese_a} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
                                            <span className="text-sm font-bold text-violet-600">
                                                {r.estudiante.nombres[0]}{r.estudiante.apellidos[0]}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-800">{r.estudiante.nombres} {r.estudiante.apellidos}</p>
                                            <Estrellas valor={r.calificacion} />
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{r.texto}</p>
                                    <div className="flex items-center justify-between pt-1 border-t border-gray-50">
                                        <span className="text-xs text-gray-400">
                                            {new Date(r.fecha_creacion).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-gray-400">{r.publicado ? 'Público' : 'Oculto'}</span>
                                            <Toggle activo={r.publicado} onChange={(v) => handleToggle(r.id_rese_a, v)} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            ) : (
                <SoporteTab />
            )}
        </div>
    )
}

export default ResenasPage
