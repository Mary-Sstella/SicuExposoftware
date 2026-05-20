import { ArrowUpRight } from 'lucide-react'

interface StatCardProps {
  title: string
  value: number | string
  icon: React.ReactNode
  description?: string
}

function StatCard({ title, value, icon, description }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-300 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <button className="w-8 h-8 rounded-xl border border-gray-100 flex items-center justify-center text-gray-300 hover:text-gray-500 hover:border-gray-200 transition-colors">
          <ArrowUpRight size={14} />
        </button>
      </div>
      <p className="text-2xl font-bold text-gray-800 mb-0.5">{value}</p>
      <p className="text-sm font-medium text-gray-600">{title}</p>
      {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
    </div>
  )
}

export default StatCard
