interface StatCardProps {
  title: string
  value: number | string
  icon: React.ReactNode
  gradient: string
  description?: string
}

function StatCard({ title, value, icon, gradient, description }: StatCardProps) {
  return (
    <div
      className={`${gradient} rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200 flex items-center gap-4`}
    >
      <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 bg-white/20">
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-sm font-medium text-white/90">{title}</p>
        {description && <p className="text-xs text-white/70">{description}</p>}
      </div>
    </div>
  )
}

export default StatCard
