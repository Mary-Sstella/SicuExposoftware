import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { Clock } from 'lucide-react'
import { useThemeStore } from '../../../shared/store/themeStore'

interface RangoData {
    hora_inicio: string
    hora_fin: string
    total_reservas: number
}

interface Props {
    data: RangoData[]
}

function TurnosChart({ data }: Props) {
    const { isDark } = useThemeStore()

    if (!data.length) return null

    const sorted = [...data].sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio))
    const chartData = sorted.map(d => ({
        label: d.hora_inicio,
        fullLabel: `${d.hora_inicio} – ${d.hora_fin}`,
        total: d.total_reservas
    }))

    const total = data.reduce((sum, d) => sum + d.total_reservas, 0)
    const masPopular = data.reduce((max, d) => d.total_reservas > max.total_reservas ? d : max, data[0])

    const tooltipStyle = {
        borderRadius: '12px',
        border: 'none',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        fontSize: '12px',
        backgroundColor: isDark ? '#1f2937' : '#ffffff',
        color: isDark ? '#e5e7eb' : '#374151',
    }

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 md:p-6 shadow-md border border-gray-200 dark:border-gray-800 col-span-1 md:col-span-2">
            <div className="flex items-start justify-between mb-6">
                <div>
                    <p className="text-xs text-gray-400 mb-1">Total reservas históricas</p>
                    <p className="text-4xl font-black text-gray-800 dark:text-white">{total}</p>
                    <p className="text-xs text-violet-500 font-semibold mt-1">
                        Horario favorito: {masPopular.hora_inicio} – {masPopular.hora_fin}
                    </p>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 rounded-2xl p-1.5 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-1.5 bg-white dark:bg-gray-700 rounded-xl px-4 py-2 shadow-sm">
                        <Clock size={14} className="text-violet-600" />
                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Preferencia de turnos</span>
                    </div>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
                    <defs>
                        <linearGradient id="colorTurnos" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.15} />
                            <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="4 4" stroke={isDark ? '#374151' : '#f1f5f9'} vertical={false} />
                    <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: isDark ? '#9ca3af' : '#6b7280' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: isDark ? '#6b7280' : '#94a3b8' }} allowDecimals={false} />
                    <Tooltip
                        cursor={{ stroke: '#7C3AED', strokeWidth: 1, strokeDasharray: '4 4' }}
                        contentStyle={tooltipStyle}
                        formatter={(value) => [value, 'Reservas']}
                        labelFormatter={(label) => chartData.find(d => d.label === label)?.fullLabel ?? label}
                    />
                    <Area
                        type="monotone"
                        dataKey="total"
                        stroke="#7C3AED"
                        strokeWidth={2.5}
                        fill="url(#colorTurnos)"
                        dot={false}
                        activeDot={{ r: 6, fill: '#f43f5e', stroke: 'white', strokeWidth: 2 }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}

export default TurnosChart
