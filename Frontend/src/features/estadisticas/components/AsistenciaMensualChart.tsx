import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts'
import { BarChart2, Users } from 'lucide-react'

interface Props {
    data: { dia: string; presentes: number; ausentes: number }[]
}

function AsistenciaMensualChart({ data }: Props) {
    const [periodo, setPeriodo] = useState('Este mes')

    const totalAusentes = data.reduce((sum, d) => sum + d.ausentes, 0)
    const totalPresentes = data.reduce((sum, d) => sum + d.presentes, 0)

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
                        <BarChart2 size={20} className="text-violet-600" />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-gray-800">Asistencia Mensual</h2>
                        <p className="text-xs text-gray-400">Registro de asistencia por día de la semana</p>
                    </div>
                </div>
                <select
                    value={periodo}
                    onChange={(e) => setPeriodo(e.target.value)}
                    className="text-xs border border-gray-200 rounded-xl px-3 py-1.5 text-gray-500 bg-white outline-none focus:ring-2 focus:ring-violet-200"
                >
                    <option>Este mes</option>
                    <option>Mes anterior</option>
                </select>
            </div>

            <div className="flex gap-4 mb-5">
                <div className="flex items-center gap-3 bg-pink-50 rounded-2xl px-4 py-3 flex-1">
                    <div className="w-9 h-9 bg-pink-100 rounded-xl flex items-center justify-center">
                        <Users size={17} className="text-pink-500" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-400">Ausentes totales</p>
                        <p className="text-2xl font-bold text-pink-500">{String(totalAusentes).padStart(2, '0')}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 bg-violet-50 rounded-2xl px-4 py-3 flex-1">
                    <div className="w-9 h-9 bg-violet-100 rounded-xl flex items-center justify-center">
                        <Users size={17} className="text-violet-600" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-400">Presentes totales</p>
                        <p className="text-2xl font-bold text-violet-600">{String(totalPresentes).padStart(2, '0')}</p>
                    </div>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={200}>
                <BarChart
                    data={data}
                    layout="vertical"
                    barSize={14}
                    barGap={4}
                    margin={{ top: 0, right: 16, bottom: 0, left: 0 }}
                >
                    <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" horizontal={false} />
                    <XAxis
                        type="number"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: '#94a3b8' }}
                        allowDecimals={false}
                    />
                    <YAxis
                        type="category"
                        dataKey="dia"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#6b7280' }}
                        width={72}
                    />
                    <Tooltip
                        cursor={{ fill: '#f5f3ff' }}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', fontSize: '12px' }}
                    />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} />
                    <Bar dataKey="ausentes" name="Ausentes" fill="#EC4899" radius={[0, 8, 8, 0]} />
                    <Bar dataKey="presentes" name="Presentes" fill="#8B5CF6" radius={[0, 8, 8, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

export default AsistenciaMensualChart
