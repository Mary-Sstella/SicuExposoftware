import { useState } from 'react'
import { LayoutDashboard, Users, ClipboardCheck, Clock, CreditCard, MessageSquare, BarChart2, ChevronLeft, ChevronRight, LogOut, ClipboardList, Settings } from 'lucide-react'
import { useAuthStore } from '../../../features/auth/store/authStore'
import { useNavigate, useLocation } from 'react-router-dom'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard',    path: '/dashboard',    iconClass: 'group-hover:scale-110' },
  { icon: Users,           label: 'Estudiantes',  path: '/estudiantes',  iconClass: 'group-hover:-translate-y-1' },
  { icon: ClipboardCheck,  label: 'Asistencia',   path: '/asistencia',   iconClass: 'group-hover:rotate-12' },
  { icon: Clock,           label: 'Turnos',       path: '/turnos',       iconClass: 'group-hover:rotate-45' },
  { icon: CreditCard,      label: 'Cartera',      path: '/cartera',      iconClass: 'group-hover:-translate-y-1 group-hover:scale-105' },
  { icon: MessageSquare,   label: 'Buzón',        path: '/buzon',        iconClass: 'group-hover:-rotate-12' },
  { icon: BarChart2,       label: 'Estadísticas', path: '/estadisticas', iconClass: 'origin-bottom group-hover:scale-y-125' },
  { icon: ClipboardList,   label: 'Solicitudes',  path: '/solicitudes',  iconClass: 'group-hover:rotate-6' },
]

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const { logout } = useAuthStore()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <div className={`hidden md:flex relative flex-col h-screen bg-violet-100 dark:bg-gray-900 rounded-2xl my-3 ml-3 shadow-md transition-all duration-300 ${collapsed ? 'w-20' : 'w-60'}`}>
      {/* Logo */}
      <div className={`flex items-center gap-3 px-5 py-6 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-400 flex items-center justify-center flex-shrink-0 shadow-md">
          <span className="font-black text-lg text-white">S</span>
        </div>
        {!collapsed && <span className="text-gray-800 dark:text-white font-bold text-lg tracking-wide">SICU</span>}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 flex flex-col gap-1">
        {navItems.map(({ icon: Icon, label, path, iconClass }) => {
          const isActive = pathname === path
          return (
            <button
              key={label}
              onClick={() => navigate(path)}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 w-full text-left
                ${isActive
                  ? 'bg-violet-600 text-white font-semibold shadow-sm'
                  : 'text-gray-800 dark:text-gray-300 hover:bg-violet-200 dark:hover:bg-gray-800 hover:text-violet-700 dark:hover:text-white'
                }
                ${collapsed ? 'justify-center' : ''}
              `}
            >
              <Icon size={20} className={`flex-shrink-0 transition-transform duration-300 ${iconClass}`} />
              {!collapsed && <span className="text-sm font-medium">{label}</span>}
            </button>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 flex flex-col gap-1">
        <button
          onClick={() => navigate('/configuracion')}
          className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 w-full text-left
            ${pathname === '/configuracion'
              ? 'bg-violet-600 text-white font-semibold shadow-sm'
              : 'text-gray-800 dark:text-gray-300 hover:bg-violet-200 dark:hover:bg-gray-800 hover:text-violet-700 dark:hover:text-white'
            }
            ${collapsed ? 'justify-center' : ''}
          `}
        >
          <Settings size={20} className="flex-shrink-0 transition-transform duration-500 group-hover:rotate-180" />
          {!collapsed && <span className="text-sm font-medium">Configuración</span>}
        </button>

        <button
          onClick={() => { logout(); navigate('/login') }}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-800 dark:text-gray-400 font-medium hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-all w-full ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut size={20} />
          {!collapsed && <span className="text-sm">Cerrar sesión</span>}
        </button>
      </div>

      {/* Toggle colapsar */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-8 z-10 w-6 h-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-400 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </div>
  )
}

export default Sidebar
