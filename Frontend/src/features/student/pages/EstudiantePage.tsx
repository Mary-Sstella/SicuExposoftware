import MiTurnoHoy from "../components/MiTurnoHoy"
import HacerReserva from "../components/HacerReserva"
import HistorialAsistencias from "../components/HistorialAsistencias"
import CalendarioEstudiante from "../components/CalendarioEstudiante"
import { UserX, UtensilsCrossed, CheckCircle, XCircle } from 'lucide-react'
import StatCard from '../../dashboard/components/StatCard'
import { useEstudianteStats } from '../hooks/useEstudianteStats'

function EstudiantePage() {
    const { stats } = useEstudianteStats()

    return (
        <div className="p-4 flex flex-col gap-3">
            <h2 className="text-sm text-gray-800">Gestiona tus turnos y reserva tu almuerzo</h2>

            {/* Fila 1: cards 2x2 | MiTurnoHoy | Calendario */}
            <div className="flex gap-3 items-stretch">
                <div className="grid grid-cols-2 gap-3 flex-shrink-0">
                    <StatCard title="Inasistencias" value={stats?.inasistencias ?? '-'} icon={<UserX size={22} className="text-violet-500" />} description="Veces que no asististe" iconBg="bg-violet-100" blob="bg-violet-200" />
                    <StatCard title="Almuerzos consumidos" value={stats?.almuerzos_consumidos ?? '-'} icon={<UtensilsCrossed size={22} className="text-violet-500" />} description="Total almorzado" iconBg="bg-violet-100" blob="bg-violet-200" />
                    <StatCard title="Pagos aprobados" value={stats?.pagos_aprobados ?? '-'} icon={<CheckCircle size={22} className="text-green-500" />} description="Comprobantes aprobados" iconBg="bg-green-100" blob="bg-green-200" />
                    <StatCard title="Pagos rechazados" value={stats?.pagos_rechazados ?? '-'} icon={<XCircle size={22} className="text-red-400" />} description="Comprobantes rechazados" iconBg="bg-red-100" blob="bg-red-200" />
                </div>

                <div className="w-64 flex-shrink-0">
                    <MiTurnoHoy />
                </div>

                <div className="w-64 flex-shrink-0">
                    <CalendarioEstudiante />
                </div>
            </div>

            {/* Fila 2: HacerReserva | Historial */}
            <div className="flex gap-5 items-start">
                <div className="w-145 flex-shrink-0"><HacerReserva /></div>
                <div className="w-130 flex-shrink-0"><HistorialAsistencias /></div>
            </div>
        </div>
    )
}

export default EstudiantePage
