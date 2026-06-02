import { ArrowUpRight, TrendingUp, TrendingDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface StatCardProps {
    title: string
    value: number | string
    icon: React.ReactNode
    description?: string
    change?: number
    changeLabel?: string
    iconBg?: string
    blob?: string
    path?: string
}

function StatCard({ title, value, icon, description, change, changeLabel, iconBg = 'bg-violet-50', blob, path }: StatCardProps) {
    const isPositive = change !== undefined && change > 0
    const isNegative = change !== undefined && change < 0
    const navigate = useNavigate()

    return (
        <div className="relative overflow-hidden bg-white dark:bg-gray-900 rounded-2xl p-4 md:p-5 shadow-sm border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow duration-200">
            {blob && <div className={`absolute -bottom-5 -right-5 w-24 h-24 rounded-full ${blob} opacity-50 dark:opacity-10`} />}

            {/* Fila superior: ícono + flecha */}
            <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${iconBg} dark:bg-gray-800 flex items-center justify-center flex-shrink-0`}>
                    {icon}
                </div>
                {path && (
                    <button
                        onClick={() => navigate(path)}
                        className="w-7 h-7 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:bg-violet-600 hover:text-white hover:border-violet-600 transition-all"
                    >
                        <ArrowUpRight size={13} />
                    </button>
                )}
            </div>

            {/* Número + título + descripción */}
            <div>
                <p className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white leading-tight">{value}</p>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mt-0.5">{title}</p>
                {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
            </div>

            {change !== undefined && (
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                    <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                        isPositive ? 'bg-green-100 text-green-600' :
                        isNegative ? 'bg-red-100 text-red-500' :
                        'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                    }`}>
                        {isPositive && <TrendingUp size={10} />}
                        {isNegative && <TrendingDown size={10} />}
                        {change > 0 ? '+' : ''}{change}%
                    </span>
                    {changeLabel && <span className="text-xs text-gray-400 truncate">{changeLabel}</span>}
                </div>
            )}
        </div>
    )
}

export default StatCard
