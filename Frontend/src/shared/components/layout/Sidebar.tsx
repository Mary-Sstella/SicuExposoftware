import { useState } from 'react'
import { LayoutDashboard, Users, ClipboardCheck, Clock, CreditCard, MessageSquare, BarChart2, ChevronLeft, ChevronRight, LogOut, ClipboardList } from 'lucide-react'
import { useAuthStore } from '../../../features/auth/store/authStore'
import { useNavigate } from 'react-router-dom'

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
  const [active, setActive] = useState('Dashboard')
  const { logout } = useAuthStore()
  const navigate = useNavigate()

  return (
    <div className={`relative flex flex-col h-screen bg-gradient-to-b from-purple-500 to-indigo-400 rounded-2xl my-3 ml-3 transition-all duration-300 ${collapsed ? 'w-20' : 'w-60'}`}>

      {/* Logo */}
      <div className={`flex items-center gap-3 px-5 py-6 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-pink-400 flex items-center justify-center flex-shrink-0 shadow-md">
          <span className="font-black text-lg text-white">S</span>
        </div>
        {!collapsed && <span className="text-white font-bold text-lg tracking-wide">SICU</span>}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 flex flex-col gap-1"> {/*menú vertical con separación*/}
         {/*un arreglo para recorrer cada opcion*/}
        {navItems.map(({ icon: Icon, label, path}) => (
          <button
            key={label}
            onClick={() => { setActive(label); navigate(path) }}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 w-full text-left
              ${active === label
                ? 'bg-white text-violet-600 font-semibold'
                : 'text-white/80 hover:bg-white/10 hover:text-white'
              }
              ${collapsed ? 'justify-center' : ''}
            `}
          >
            <Icon size={20} className="flex-shrink-0" />
            {!collapsed && <span className="text-sm">{label}</span>}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4">
        <button onClick={() => { logout(); navigate('/login') }} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-all w-full ${collapsed ? 'justify-center' : ''}`}>
          <LogOut size={20} />
          {!collapsed && <span className="text-sm">Cerrar sesión</span>}
        </button>
      </div>

      {/* Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-8 z-10 w-6 h-6 bg-purple-500 border border-indigo-300 text-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

    </div>
  )
}

export default Sidebar
