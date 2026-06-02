import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { Users } from 'lucide-react'
import { useThemeStore } from '../../../shared/store/themeStore'

interface Props {
    data: { dia: string; presentes: number; ausentes: number }[]
}

function AsistenciaMensualChart({ data }: Props) {
    const { isDark } = useThemeStore()

    const totalAusentes  = data.reduce((sum, d) => sum + d.ausentes, 0)
    const totalPresentes = data.reduce((sum, d) => sum + d.presentes, 0)

    const tooltipStyle = {
        borderRadius: '12px',
        border: 'none',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        fontSize: '12px',
        backgroundColor: isDark ? '#1f2937' : '#ffffff',
        color: isDark ? '#e5e7eb' : '#374151',
    }

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h2 className="text-sm font-bold text-gray-700 dark:text-gray-200">Asistencia por día</h2>
                    <p className="text-xs text-gray-400">Presentes y ausentes por día de la semana</p>
                </div>
            </div>

            <div className="flex gap-3 mb-6">
                <div className="flex items-center gap-3 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900/30 rounded-2xl px-4 py-3 flex-1">
                    <div className="w-9 h-9 bg-rose-100 dark:bg-rose-900/30 rounded-xl flex items-center justify-center">
                        <Users size={16} className="text-rose-500" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-400">Ausentes</p>
                        <p className="text-2xl font-bold text-rose-500">{String(totalAusentes).padStart(2, '0')}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 bg-violet-50 dark:bg-violet-900/20 border border-violet-100 dark:border-violet-900/30 rounded-2xl px-4 py-3 flex-1">
                    <div className="w-9 h-9 bg-violet-100 dark:bg-violet-900/30 rounded-xl flex items-center justify-center">
                        <Users size={16} className="text-violet-600" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-400">Presentes</p>
                        <p className="text-2xl font-bold text-violet-600">{String(totalPresentes).padStart(2, '0')}</p>
                    </div>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data} barSize={18} barGap={4} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
                    <CartesianGrid strokeDasharray="4 4" stroke={isDark ? '#374151' : '#f1f5f9'} vertical={false} />
                    <XAxis dataKey="dia" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: isDark ? '#9ca3af' : '#6b7280' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: isDark ? '#6b7280' : '#94a3b8' }} allowDecimals={false} />
                    <Tooltip
                        cursor={{ fill: isDark ? '#374151' : '#f5f3ff', radius: 8 }}
                        contentStyle={tooltipStyle}
                    />
                    <Bar dataKey="presentes" name="Presentes" fill="#7C3AED" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="ausentes"  name="Ausentes"  fill="#FB7185" radius={[6, 6, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>

            <div className="flex items-center justify-center gap-6 mt-3">
                <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-violet-600" />
                    <span className="text-xs text-gray-400">Presentes</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                    <span className="text-xs text-gray-400">Ausentes</span>
                </div>
            </div>
        </div>
    )
}

export default AsistenciaMensualChart
