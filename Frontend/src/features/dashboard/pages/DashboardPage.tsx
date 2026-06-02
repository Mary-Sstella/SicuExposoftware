import { Users, UserCheck, CreditCard, CalendarCheck } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts'
import Calendar from 'react-calendar'
import '../../../styles/calendar.css'
import StatCard from '../components/StatCard'
import { useDashboard } from '../hooks/useDashboard'
import { useThemeStore } from '../../../shared/store/themeStore'

const legendStyle     = { fontSize: '12px', paddingTop: '16px', color: '#111827' }
const legendStyleDark = { fontSize: '12px', paddingTop: '16px', color: '#e5e7eb' }

function DashboardPage() {
  const { summary, loading, asistenciaSemanal, actividades } = useDashboard()
  const { isDark } = useThemeStore()

  const tooltipStyle = {
    borderRadius: '14px',
    border: 'none',
    boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
    fontSize: '12px',
    padding: '10px 14px',
    backgroundColor: isDark ? '#1f2937' : '#ffffff',
    color: isDark ? '#e5e7eb' : '#374151',
  }
  const xTick = { fontSize: 12, fill: isDark ? '#94a3b8' : '#475569' }
  const yTick = { fontSize: 11, fill: isDark ? '#94a3b8' : '#475569' }

  return (
    <div className="flex-1 p-4 md:p-8 pb-24 md:pb-8 overflow-y-auto bg-slate-100 dark:bg-gray-950">

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Bienvenido, Administrador</h1>
        <p className="text-sm text-gray-400 mt-0.5">Aquí tienes un resumen general del sistema</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Estudiantes" value={loading ? '...' : summary?.total_estudiantes ?? 0} icon={<Users size={20} className="text-violet-500" />} description="Registrados en el sistema" change={summary?.total_estudiantes_change} changeLabel="vs. mes anterior" path="/estudiantes" />
        <StatCard title="Activos" value={loading ? '...' : summary?.estudiantes_activos ?? 0} icon={<UserCheck size={20} className="text-violet-500" />} description="Con estado activo" change={summary?.estudiantes_activos_change} changeLabel="vs. mes anterior" path="/estudiantes" />
        <StatCard title="Pagos Pendientes" value={loading ? '...' : summary?.pagos_pendientes ?? 0} icon={<CreditCard size={20} className="text-violet-500" />} description="Por cobrar" change={summary?.pagos_pendientes_change} changeLabel="vs. mes anterior" path="/cartera" />
        <StatCard title="Asistencias Hoy" value={loading ? '...' : summary?.asistencias_hoy ?? 0} icon={<CalendarCheck size={20} className="text-violet-500" />} description="Registradas hoy" change={summary?.asistencias_hoy_change} changeLabel="vs. ayer" path="/asistencia" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="col-span-1 md:col-span-2 bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow duration-200">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-gray-700 dark:text-gray-200">Asistencia Semanal</h2>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={asistenciaSemanal} barGap={8} barSize={35} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="4 4" stroke={isDark ? '#374151' : '#f1f5f9'} vertical={false} />
              <XAxis dataKey="dia" axisLine={false} tickLine={false} tick={xTick} />
              <YAxis axisLine={false} tickLine={false} tick={yTick} />
              <Tooltip contentStyle={tooltipStyle} labelStyle={{ fontWeight: 600, marginBottom: 4 }} cursor={{ fill: isDark ? '#374151' : '#f5f3ff' }} />
              <Legend wrapperStyle={isDark ? legendStyleDark : legendStyle} iconType="circle" iconSize={8} />
              <Bar dataKey="presentes" fill="#8f67ee" radius={[6, 6, 0, 0]} stroke="#6D28D9" strokeWidth={1.5} />
              <Bar dataKey="ausentes" fill="#EC489960" radius={[6, 6, 0, 0]} stroke="#F472B6" strokeWidth={1.5} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-md border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow duration-200">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-gray-700 dark:text-gray-200">Calendario</h2>
          </div>
          <Calendar />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow duration-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-gray-700 dark:text-gray-200">Actividad Reciente</h2>
            <p className="text-xs text-gray-400 mt-0.5">Últimas acciones del sistema</p>
          </div>
          <button className="text-sm text-violet-600 font-semibold hover:text-violet-700 transition-colors">Ver todas</button>
        </div>
        <ul className="flex flex-col gap-1">
          {actividades.map((item, i) => (
            <li key={i} className="flex items-center gap-3 py-3 border-b border-gray-50 dark:border-gray-800 last:border-0">
              <div className="w-9 h-9 rounded-full bg-violet-50 dark:bg-violet-900/30 flex items-center justify-center flex-shrink-0">
                <Users size={16} className="text-violet-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-700 dark:text-gray-300">{item.descripcion}</p>
                <p className="text-xs text-gray-400 mt-0.5">{new Date(item.fecha).toLocaleString('es-CO', { timeZone: 'America/Bogota' })}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

    </div>
  )
}

export default DashboardPage
