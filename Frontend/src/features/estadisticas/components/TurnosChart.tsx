import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { Clock } from 'lucide-react'

interface RangoData {
    hora_inicio: string
    hora_fin: string
    total_reservas: number
}

interface Props {
    data: RangoData[]
}

function TurnosChart({ data }: Props) {
    if (!data.length) return null

    const sorted = [...data].sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio))
    const chartData = sorted.map(d => ({
        label: d.hora_inicio,
        fullLabel: `${d.hora_inicio} – ${d.hora_fin}`,
        total: d.total_reservas
    }))

    const total = data.reduce((sum, d) => sum + d.total_reservas, 0)
    const masPopular = data.reduce((max, d) => d.total_reservas > max.total_reservas ? d : max, data[0])

    return (
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-300 col-span-2">
            <div className="flex items-start justify-between mb-6">
                <div>
                    <p className="text-xs text-gray-400 mb-1">Total reservas históricas</p>
                    <p className="text-4xl font-black text-gray-800">{total}</p>
                    <p className="text-xs text-violet-500 font-semibold mt-1">
                        Horario favorito: {masPopular.hora_inicio} – {masPopular.hora_fin}
                    </p>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 rounded-2xl p-1.5 border border-gray-100">
                    <div className="flex items-center gap-1.5 bg-white rounded-xl px-4 py-2 shadow-sm">
                        <Clock size={14} className="text-violet-600" />
                        <span className="text-xs font-semibold text-gray-700">Preferencia de turnos</span>
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
                    <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
                    <XAxis
                        dataKey="label"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#6b7280' }}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: '#94a3b8' }}
                        allowDecimals={false}
                    />
                    <Tooltip
                        cursor={{ stroke: '#7C3AED', strokeWidth: 1, strokeDasharray: '4 4' }}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', fontSize: '12px' }}
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
