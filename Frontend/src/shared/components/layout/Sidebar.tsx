import { useState } from 'react'
import { LayoutDashboard, Users, ClipboardCheck, Clock, CreditCard, MessageSquare, BarChart2, ChevronLeft, ChevronRight, LogOut } from 'lucide-react'
import { useAuthStore } from '../../../features/auth/store/authStore'
import { useNavigate } from 'react-router-dom'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard' },
  { icon: Users, label: 'Estudiantes' },
  { icon: ClipboardCheck, label: 'Asistencia' },
  { icon: Clock, label: 'Turnos' },
  { icon: CreditCard, label: 'Cartera' },
  { icon: MessageSquare, label: 'Comentarios' },
  { icon: BarChart2, label: 'Estadísticas' },
]

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [active, setActive] = useState('Dashboard')
  const { logout } = useAuthStore()
  const navigate = useNavigate()

  return (
    <div className={`relative flex flex-col h-screen bg-purple-600 rounded-r-3xl transition-all duration-300 ${collapsed ? 'w-20' : 'w-60'}`}>

      {/* Logo */}
      <div className={`flex items-center gap-3 px-5 py-6 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center flex-shrink-0 shadow-md">
          <span className="font-black text-lg bg-gradient-to-br from-purple-600 to-pink-500 bg-clip-text text-transparent">S</span>
        </div>
        {!collapsed && <span className="text-white font-bold text-lg tracking-wide">SICU</span>}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 flex flex-col gap-1"> {/*menú vertical con separación*/}
         {/*un arreglo para recorrer cada opcion*/}
        {navItems.map(({ icon: Icon, label }) => (
          <button
            key={label}
            onClick={() => setActive(label)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 w-full text-left
              ${active === label
                ? 'bg-white text-purple-600 font-semibold'
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
        className="absolute -right-3 top-8 w-6 h-6 bg-purple-600 border border-purple-400 text-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

    </div>
  )
}

export default Sidebar
