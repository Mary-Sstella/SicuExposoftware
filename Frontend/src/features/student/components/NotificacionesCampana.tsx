import { useState, useRef, useEffect } from 'react'
import { Bell } from 'lucide-react'
import useNotificaciones from '../hooks/useNotificaciones'

const tiempoRelativo = (fecha: string) => {
    const diff = Date.now() - new Date(fecha).getTime()
    const min = Math.floor(diff / 60000)
    if (min < 1) return 'Ahora'
    if (min < 60) return `Hace ${min} min`
    const horas = Math.floor(min / 60)
    if (horas < 24) return `Hace ${horas} h`
    const dias = Math.floor(horas / 24)
    return `Hace ${dias} día${dias > 1 ? 's' : ''}`
}

const NotificacionesCampana = () => {
    const [abierto, setAbierto] = useState(false)
    const panelRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                setAbierto(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])
    const { notificaciones, noLeidas, loading, leerUna, leerTodas } = useNotificaciones()

    const badge = noLeidas > 9 ? '9+' : noLeidas

    return (
        <div className="relative" ref={panelRef}>
            <button
                onClick={() => setAbierto(prev => !prev)}
                className="relative p-2 rounded-full hover:bg-violet-50 transition-colors"
            >
                <Bell size={20} className="text-violet-600" />
                {noLeidas > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                        {badge}
                    </span>
                )}
            </button>

            {abierto && (
                <div className="absolute right-0 top-10 w-80 bg-white rounded-xl shadow-lg border border-gray-100 z-50">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                        <span className="font-bold text-sm text-gray-800">Notificaciones</span>
                        {noLeidas > 0 && (
                            <button
                                onClick={leerTodas}
                                className="text-xs text-violet-600 hover:text-violet-800 transition-colors"
                            >
                                Marcar todas como leídas
                            </button>
                        )}
                    </div>

                    <div className="overflow-y-auto max-h-[400px]">
                        {loading ? (
                            <p className="text-center text-sm text-gray-400 py-6">Cargando...</p>
                        ) : notificaciones.length === 0 ? (
                            <p className="text-center text-sm text-gray-400 py-6">No tienes notificaciones</p>
                        ) : (
                            notificaciones.map(n => (
                                <div
                                    key={n.id_notificacion}
                                    onClick={() => !n.leida && leerUna(n.id_notificacion)}
                                    className={`px-4 py-3 border-b border-gray-50 cursor-pointer transition-colors hover:bg-violet-50 ${
                                        n.leida ? 'bg-white' : 'bg-violet-50'
                                    }`}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <p className="font-medium text-sm text-gray-800">{n.titulo}</p>
                                        {!n.leida && (
                                            <span className="w-2 h-2 mt-1.5 rounded-full bg-violet-500 shrink-0" />
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.mensaje}</p>
                                    <p className="text-[11px] text-gray-400 mt-1">{tiempoRelativo(n.fecha_creacion)}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default NotificacionesCampana
