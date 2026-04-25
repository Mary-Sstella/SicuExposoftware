interface StatCardProps {
  title: string
  value: number | string
  icon: React.ReactNode
  iconBg: string
  borderColor: string
  description?: string
}

function StatCard({ title, value, icon, iconBg, borderColor, description }: StatCardProps) {
  return (
    <div
      className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200 flex items-center gap-4"
      style={{ borderLeft: `4px solid ${borderColor}` }}
    >
      <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: iconBg }}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        {description && <p className="text-xs text-gray-400">{description}</p>}
      </div>
    </div>
  )
}

export default StatCard
