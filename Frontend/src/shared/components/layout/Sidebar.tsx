import { useState } from 'react'
import { LayoutDashboard, Users, ClipboardCheck, Clock, CreditCard, MessageSquare, BarChart2, ChevronLeft, ChevronRight, LogOut, ClipboardList } from 'lucide-react'
import { useAuthStore } from '../../../features/auth/store/authStore'
import { useNavigate, useLocation } from 'react-router-dom'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Users, label: 'Estudiantes', path: '/estudiantes' },
  { icon: ClipboardCheck, label: 'Asistencia', path: '/asistencia' },
  { icon: Clock, label: 'Turnos', path: '/turnos' },
  { icon: CreditCard, label: 'Cartera', path: '/cartera' },
  { icon: MessageSquare, label: 'Comentarios', path: '/comentarios' },
  { icon: BarChart2, label: 'Estadísticas', path: '/estadisticas' },
  { icon: ClipboardList, label: 'Solicitudes', path: '/solicitudes' },
]

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const { logout } = useAuthStore()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <div className={`relative flex flex-col h-screen bg-violet-100 rounded-2xl my-3 ml-3 shadow-md transition-all duration-300 ${collapsed ? 'w-20' : 'w-60'}`}>

      {/* Logo */}
      <div className={`flex items-center gap-3 px-5 py-6 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-400 flex items-center justify-center flex-shrink-0 shadow-md">
          <span className="font-black text-lg text-white">S</span>
        </div>
        {!collapsed && <span className="text-gray-800 font-bold text-lg tracking-wide">SICU</span>}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 flex flex-col gap-1">
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive = pathname === path
          return (
            <button
              key={label}
              onClick={() => navigate(path)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 w-full text-left
                ${isActive ? 'bg-violet-600 text-white font-semibold shadow-sm' : 'text-gray-500 hover:bg-violet-100 hover:text-violet-700'}
                ${collapsed ? 'justify-center' : ''}
              `}
            >
              <Icon size={20} className="flex-shrink-0" />
              {!collapsed && <span className="text-sm">{label}</span>}
            </button>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 flex flex-col gap-1">
<button onClick={() => { logout(); navigate('/login') }} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all w-full ${collapsed ? 'justify-center' : ''}`}>
          <LogOut size={20} />
          {!collapsed && <span className="text-sm">Cerrar sesión</span>}
        </button>
      </div>

      {/* Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-8 z-10 w-6 h-6 bg-white border border-gray-200 text-gray-400 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </div>
  )
}

export default Sidebar
