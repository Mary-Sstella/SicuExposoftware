import { LogOut, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../../features/auth/store/authStore'

const tabs = [
    { label: 'Mi Turno', path: '/student' },
    { label: 'Billetera', path: '/student/pago' },
    { label: 'Reseñas', path: '/student/resenas' },
]

function StudentTopbar() {
    const [menuOpen, setMenuOpen] = useState(false)
    const { username, logout } = useAuthStore()
    const navigate = useNavigate()
    const location = useLocation()

    return (
        <div className="bg-violet-200 px-6 shadow-sm flex-shrink-0">
            <div className="flex items-center justify-between h-14">
                {/* Logo */}
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-400 flex items-center justify-center shadow-md">
                        <span className="font-black text-base text-white">S</span>
                    </div>
                    <span className="font-bold text-lg text-gray-800 tracking-wide">SICU</span>
                </div>

                {/* Avatar + dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="flex items-center gap-2 bg-white hover:bg-violet-50 border border-violet-200 px-3 py-1.5 rounded-full transition"
                    >
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-purple-400 flex items-center justify-center text-xs font-black text-white">
                            {username?.charAt(0).toUpperCase() ?? 'E'}
                        </div>
                        <span className="text-sm font-medium text-gray-700">{username}</span>
                        <ChevronDown size={14} className="text-gray-400" />
                    </button>
                    {menuOpen && (
                        <div className="absolute right-0 top-10 bg-white rounded-xl shadow-lg border border-gray-100 py-1 min-w-36 z-50">
                            <button
                                onClick={() => { logout(); navigate('/login') }}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-red-500 hover:bg-red-50 w-full text-left transition rounded-xl"
                            >
                                <LogOut size={14} />
                                Cerrar sesión
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Tabs */}
           <div className="flex gap-6 justify-center">
                {tabs.map(tab => {
                    const active = location.pathname === tab.path
                    return (
                        <button
                            key={tab.path}
                            onClick={() => navigate(tab.path)}
                            className={`text-sm font-semibold pb-2 border-b-2 transition-all ${
                                active
                                    ? 'border-violet-600 text-violet-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            {tab.label}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

export default StudentTopbar
