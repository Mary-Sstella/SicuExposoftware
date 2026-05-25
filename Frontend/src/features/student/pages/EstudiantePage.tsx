import { useState, useEffect } from 'react'
import { UserX, UtensilsCrossed, CheckCircle, XCircle, Plus, X } from 'lucide-react'
import { useEstudianteStats } from '../hooks/useEstudianteStats'
import { useAuthStore } from '../../auth/store/authStore'
import { getPerfilEstudiante } from '../services/estudianteService'
import CredencialCard from '../components/CredencialCard'
import MiTurnoHoy from '../components/MiTurnoHoy'
import MenuDelDia from '../../menu/components/MenuDelDia'
import HacerReserva from '../components/HacerReserva'
import SemanaEstudiante from '../components/SemanaEstudiante'
import HistorialAsistencias from '../components/HistorialAsistencias'
import StatCard from '../../dashboard/components/StatCard'

function EstudiantePage() {
    const { stats } = useEstudianteStats()
    const { id_estudiante } = useAuthStore()
    const [modalReserva, setModalReserva] = useState(false)
    const [nombre, setNombre] = useState('')

    useEffect(() => {
        if (id_estudiante)
            getPerfilEstudiante(id_estudiante).then(p => setNombre(p.nombres.split(' ')[0]))
    }, [id_estudiante])

    const hoyLabel = new Date().toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })

    return (
        <div className="p-4 flex gap-4 h-full">

            {/* Columna izquierda: Credencial */}
            <div className="w-74 flex-shrink-0">
                <CredencialCard />
            </div>

            {/* Columna derecha */}
            <div className="flex-1 flex flex-col gap-4 min-w-0">

                {/* Saludo */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-black text-gray-800">Hola, {nombre || '—'}</h1>
                        <p className="text-xs text-gray-400 capitalize">{hoyLabel}</p>
                    </div>
                    <button
                        onClick={() => setModalReserva(true)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-br from-violet-500 to-purple-400 text-white text-sm font-semibold rounded-2xl hover:opacity-90 transition shadow-sm"
                    >
                        <Plus size={16} /> Nueva reserva
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-3">
                    <StatCard title="Inasistencias" value={stats?.inasistencias ?? '-'} icon={<UserX size={22} className="text-violet-500" />} description="Veces que no asististe" iconBg="bg-violet-100" blob="bg-violet-200" />
                    <StatCard title="Almuerzos consumidos" value={stats?.almuerzos_consumidos ?? '-'} icon={<UtensilsCrossed size={22} className="text-violet-500" />} description="Total almorzado" iconBg="bg-violet-100" blob="bg-violet-200" />
                    <StatCard title="Pagos aprobados" value={stats?.pagos_aprobados ?? '-'} icon={<CheckCircle size={22} className="text-green-500" />} description="Comprobantes aprobados" iconBg="bg-green-100" blob="bg-green-200" />
                    <StatCard title="Pagos rechazados" value={stats?.pagos_rechazados ?? '-'} icon={<XCircle size={22} className="text-red-400" />} description="Comprobantes rechazados" iconBg="bg-red-100" blob="bg-red-200" />
                </div>

                {/* Turno hoy + Menú del día */}
                <div className="grid grid-cols-2 gap-3">
                    <MiTurnoHoy />
                    <MenuDelDia />
                </div>

                {/* Tu semana + Historial */}
                <div className="flex flex-col gap-3">
                    <SemanaEstudiante />
                    <HistorialAsistencias />
                </div>

            </div>

            {/* Modal: Hacer reserva */}
            {modalReserva && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-xl w-full max-w-sm">
                        <div className="flex items-center justify-between p-5 border-b border-gray-100">
                            <h2 className="text-base font-bold text-gray-800">Nueva reserva</h2>
                            <button onClick={() => setModalReserva(false)} className="text-gray-300 hover:text-gray-500 transition">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-5">
                            <HacerReserva />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default EstudiantePage
