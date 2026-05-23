import { ArrowUpRight, TrendingUp, TrendingDown } from 'lucide-react'

interface StatCardProps {
    title: string
    value: number | string
    icon: React.ReactNode
    description?: string
    change?: number
    changeLabel?: string
    iconBg?: string
    blob?: string
}

function StatCard({ title, value, icon, description, change, changeLabel, iconBg = 'bg-violet-50', blob }: StatCardProps) {
    const isPositive = change !== undefined && change > 0
    const isNegative = change !== undefined && change < 0

    return (
        <div className="relative overflow-hidden bg-white rounded-2xl p-5 shadow-sm border border-gray-700 hover:shadow-md transition-shadow duration-200">
            {blob && <div className={`absolute -bottom-5 -right-5 w-24 h-24 rounded-full ${blob} opacity-50`} />}
            <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
                        {icon}
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-800 leading-tight">{value}</p>
                        <p className="text-sm font-semibold text-gray-700">{title}</p>
                        {description && <p className="text-xs text-gray-400">{description}</p>}
                    </div>
                </div>
                <button className="w-8 h-8 rounded-xl border border-gray-700 flex items-center justify-center text-gray-700 hover:text-black hover:border-black transition-colors flex-shrink-0">
                    <ArrowUpRight size={14} />
                </button>
            </div>

            {change !== undefined && (
                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                    <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                        isPositive ? 'bg-green-100 text-green-600' :
                        isNegative ? 'bg-red-100 text-red-500' :
                        'bg-gray-100 text-gray-500'
                    }`}>
                        {isPositive && <TrendingUp size={11} />}
                        {isNegative && <TrendingDown size={11} />}
                        {change > 0 ? '+' : ''}{change}%
                    </span>
                    {changeLabel && <span className="text-xs text-gray-400">{changeLabel}</span>}
                </div>
            )}
        </div>
    )
}

export default StatCard
