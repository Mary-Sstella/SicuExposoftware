import { Users, UserCheck, CreditCard, CalendarCheck } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts'
import Calendar from 'react-calendar'
import '../../../styles/calendar.css'
import StatCard from '../components/StatCard'
import { useDashboard } from '../hooks/useDashboard'


const tooltipStyle = {
  borderRadius: '14px',
  border: 'none',
  boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
  fontSize: '12px',
  padding: '10px 14px',
}
const xTickStyle = { fontSize: 12, fill: '#94a3b8' }
const yTickStyle = { fontSize: 11, fill: '#6b7280' }
const legendStyle = { fontSize: '12px', paddingTop: '16px', color: '#111827' }

function DashboardPage() {
  const { summary, loading, asistenciaSemanal, actividades } = useDashboard()

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-gray-50">

      {/* Tarjetas */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Estudiantes"
          value={loading ? '...' : summary?.total_estudiantes ?? 0}
          icon={<Users size={18} color="white" />}
          gradient="bg-gradient-to-br from-pink-500 to-rose-400"
          description="Registrados en el sistema"
        />
        <StatCard
          title="Activos"
          value={loading ? '...' : summary?.estudiantes_activos ?? 0}
          icon={<UserCheck size={18} color="white" />}
          gradient="bg-gradient-to-br from-purple-500 to-indigo-400"
          description="Con estado activo"
        />
        <StatCard
          title="Pagos Pendientes"
          value={loading ? '...' : summary?.pagos_pendientes ?? 0}
          icon={<CreditCard size={18} color="white" />}
          gradient="bg-gradient-to-br from-cyan-400 to-blue-400"
          description="Por cobrar"
        />
        <StatCard
          title="Asistencias Hoy"
          value={loading ? '...' : summary?.asistencias_hoy ?? 0}
          icon={<CalendarCheck size={18} color="white" />}
          gradient="bg-gradient-to-br from-orange-400 to-amber-300"
          description="Registradas hoy"
        />
      </div>
      <div className="grid grid-cols-3 gap-6 mb-6">

        {/* Gráfica */}
        <div className="col-span-2 bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-gray-700">Asistencia Semanal</h2>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={asistenciaSemanal} barGap={8} barSize={35} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="dia" axisLine={false} tickLine={false} tick={xTickStyle} />
              <YAxis axisLine={false} tickLine={false} tick={yTickStyle} />
              <Tooltip contentStyle={tooltipStyle} labelStyle={{ fontWeight: 600, color: '#374151', marginBottom: 4 }} cursor={{ fill: '#f5f3ff' }} />
              <Legend wrapperStyle={legendStyle} iconType="circle" iconSize={8} />
              <Bar dataKey="presentes" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
              <Bar dataKey="ausentes" fill="#EC489960" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Calendario */}
        <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-gray-700">Calendario</h2>
          </div>
          <Calendar />
        </div>

      </div>

      {/* Actividad reciente*/}
      <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 mt-6">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-gray-700">Actividad Reciente</h2>
          <p className="text-xs text-gray-400 mt-0.5">Últimas acciones del sistema</p>
        </div>
        <ul className="flex flex-col gap-1">
          {actividades.map((item, i) => (
            <li key={i} className="flex flex-col gap-0.5 py-3 border-b border-gray-50 last:border-0 hover:bg-pink-50 rounded-xl px-2 transition-colors duration-150">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-pink-400 flex-shrink-0 mt-1.5" />
                <span className="text-sm text-gray-600 leading-snug">{item.descripcion}</span>
              </div>
              <span className="text-xs text-gray-400 pl-4">{new Date(item.fecha).toLocaleString('es-CO', { timeZone: 'America/Bogota' })}</span>
            </li>
          ))}
        </ul>
      </div>

    </div>
  )
}

export default DashboardPage
