import { useState } from 'react'
import { Clock, CreditCard, ChevronLeft, ChevronRight, LogOut } from 'lucide-react'
import { useAuthStore } from '../../../features/auth/store/authStore'
import { useNavigate } from 'react-router-dom'


const navItems = [
  { icon: Clock, label: 'Mis Turnos', path: '/student' },
  { icon: CreditCard, label: 'Billetera', path: '/student/pago' },
]

function StudentSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [active, setActive] = useState('Mis Turnos')
  const { logout, username } = useAuthStore()
  const navigate = useNavigate()

  return (
    <div className={`relative flex flex-col h-screen bg-gradient-to-b from-purple-500 to-indigo-400 rounded-2xl my-3 ml-3 transition-all duration-300 ${collapsed ? 'w-20' : 'w-60'}`}>

      {/* USUARIO */}
      <div className={`flex items-center gap-3 px-5 py-6 border-b border-white/20 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-md">
          <span className="font-black text-sm text-white uppercase">{username?.charAt(0) ?? 'E'}</span>
        </div>
        {!collapsed && (
          <div>
            <p className="text-white font-semibold text-sm leading-tight">{username ?? 'Estudiante'}</p>
            <p className="text-white/60 text-xs">Portal estudiantil</p>
          </div>
        )}
      </div>

      {/* NAV */}
      <nav className="flex-1 px-3 pt-4 flex flex-col gap-1">
        {navItems.map(({ icon: Icon, label, path }) => (
          <button
            key={label}
            onClick={() => { setActive(label); navigate(path) }}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 w-full text-left
              ${active === label
                ? 'bg-white text-violet-600 font-semibold'
                : 'text-white/80 hover:bg-white/10 hover:text-white'}

              ${collapsed ? 'justify-center' : ''}
            `}
          >
            <Icon size={20} className="flex-shrink-0" />
            {!collapsed && <span className="text-sm">{label}</span>}
          </button>
        ))}
      </nav>

      {/* CERRAR SESION */}
      <div className="px-3 py-4 border-t border-white/20">
        <button
          onClick={() => { logout(); navigate('/login') }}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/50 hover:text-white hover:bg-white/15 transition-all w-full ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut size={20} />
          {!collapsed && <span className="text-sm">Cerrar sesión</span>}
        </button>
      </div>

      {/* TOGGLE */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-8 z-10 w-6 h-6 bg-purple-500 border border-indigo-300 text-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </div>
  )
}

export default StudentSidebar
