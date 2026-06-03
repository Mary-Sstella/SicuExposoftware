import { LayoutDashboard, Users, ClipboardCheck, Clock, CreditCard, MessageSquare, BarChart2, ClipboardList } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard',   path: '/dashboard' },
  { icon: Users,           label: 'Estudiantes', path: '/estudiantes' },
  { icon: ClipboardCheck,  label: 'Asistencia',  path: '/asistencia' },
  { icon: Clock,           label: 'Turnos',      path: '/turnos' },
  { icon: CreditCard,      label: 'Cartera',     path: '/cartera' },
  { icon: MessageSquare,   label: 'Buzón',       path: '/buzon' },
  { icon: BarChart2,       label: 'Estadísticas',path: '/estadisticas' },
  { icon: ClipboardList,   label: 'Solicitudes', path: '/solicitudes' },
]

function BottomNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <nav className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50
                    bg-white border border-gray-200 rounded-full px-4 py-2 shadow-2xl
                    flex items-end gap-1">
      {navItems.map(({ icon: Icon, label, path }) => {
        const isActive = pathname === path
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            title={label}
            className="relative flex flex-col items-center justify-end w-10 h-12"
          >
            {isActive ? (
              <span className="absolute -top-5 flex items-center justify-center
                               w-12 h-12 rounded-full bg-violet-600 shadow-lg shadow-violet-400/50
                               border-4 border-white">
                <Icon size={20} className="text-white" />
              </span>
            ) : (
              <Icon size={20} className="text-gray-400 hover:text-violet-600 transition-colors mb-1" />
            )}
          </button>
        )
      })}
    </nav>
  )
}

export default BottomNav
