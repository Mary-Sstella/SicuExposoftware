import { useState } from 'react'
import { GraduationCap, ChevronDown, ChevronUp } from 'lucide-react'

const COLORS = [
  '#8B5CF6', '#EC4899', '#06B6D4', '#F59E0B', '#10B981', '#3B82F6', '#F97316',
  '#14B8A6', '#EF4444', '#A855F7', '#84CC16', '#F43F5E', '#0EA5E9', '#D97706',
  '#22C55E', '#6366F1', '#E879F9', '#2DD4BF', '#FB923C', '#4ADE80',
]

const VISIBLE_COUNT = 8

interface Props {
    data: { carrera: string; total: number }[]
}

function CarreraChart({ data }: Props) {
    const [expanded, setExpanded] = useState(false)

    const total = data.reduce((sum, d) => sum + d.total, 0)
    const maxVal = Math.max(...data.map(d => d.total), 1)

    const sorted = [...data].sort((a, b) => b.total - a.total)
    const visible = expanded ? sorted : sorted.slice(0, VISIBLE_COUNT)
    const hasMore = sorted.length > VISIBLE_COUNT

    return (
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-300">
            <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
                        <GraduationCap size={20} className="text-violet-600" />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-gray-800">Estudiantes por Carrera</h2>
                        <p className="text-xs text-gray-400">Distribución total de estudiantes inscritos</p>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-xs text-gray-400">Total</span>
                    <span className="text-sm font-bold text-violet-600">{total}</span>
                </div>
            </div>

            <div className="flex flex-col gap-3">
                {visible.map((d) => {
                    const pct = Math.round((d.total / maxVal) * 100)
                    const color = COLORS[sorted.indexOf(d) % COLORS.length]
                    return (
                        <div key={d.carrera} className="flex items-center gap-3">
                            <span className="text-xs text-gray-500 w-32 shrink-0 truncate text-right">{d.carrera}</span>
                            <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-500"
                                    style={{ width: `${pct}%`, backgroundColor: color }}
                                />
                            </div>
                            <span className="text-xs font-semibold text-gray-500 w-5 text-right shrink-0">{d.total}</span>
                        </div>
                    )
                })}
            </div>

            {hasMore && (
                <button
                    onClick={() => setExpanded(prev => !prev)}
                    className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-violet-500 hover:text-violet-700 transition-colors mx-auto"
                >
                    {expanded ? (
                        <><ChevronUp size={14} /> Ver menos</>
                    ) : (
                        <><ChevronDown size={14} /> Ver todas ({sorted.length - VISIBLE_COUNT} más)</>
                    )}
                </button>
            )}
        </div>
    )
}

export default CarreraChart
