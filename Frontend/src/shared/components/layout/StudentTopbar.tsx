import { LogOut, ChevronDown, Sun, Moon } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../../features/auth/store/authStore'
import NotificacionesCampana from '../../../features/student/components/NotificacionesCampana'
import { useThemeStore } from '../../store/themeStore'

const tabs = [
    { label: 'Panel', path: '/student' },
    { label: 'Billetera', path: '/student/pago' },
    { label: 'Reseñas', path: '/student/resenas' },
]

function StudentTopbar() {
    const [menuOpen, setMenuOpen] = useState(false)
    const { username, logout } = useAuthStore()
    const navigate = useNavigate()
    const location = useLocation()
    const { isDark, toggleTheme } = useThemeStore()

    return (
        <div className="bg-violet-200 dark:bg-gray-900 px-6 shadow-sm flex-shrink-0 border-b border-violet-300/50 dark:border-gray-800">
            <div className="flex items-center justify-between h-14">
                {/* Logo */}
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-400 flex items-center justify-center shadow-md">
                        <span className="font-black text-base text-white">S</span>
                    </div>
                    <span className="font-bold text-lg text-gray-800 dark:text-white tracking-wide">SICU</span>
                </div>

                {/* Campanita + Toggle + Avatar */}
                <div className="flex items-center gap-2">
                    <NotificacionesCampana />

                    {/* Toggle oscuro/claro */}
                    <button
                        onClick={toggleTheme}
                        className={`relative flex items-center w-14 h-7 rounded-full p-1 transition-colors duration-300 ${
                            isDark ? 'bg-violet-600' : 'bg-white/60'
                        }`}
                    >
                        <span className={`absolute flex items-center justify-center w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${
                            isDark ? 'translate-x-7' : 'translate-x-0'
                        }`}>
                            {isDark
                                ? <Moon size={11} className="text-violet-600" />
                                : <Sun size={11} className="text-amber-500" />
                            }
                        </span>
                    </button>

                    <div className="relative">
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="flex items-center gap-2 bg-white dark:bg-gray-800 hover:bg-violet-50 dark:hover:bg-gray-700 border border-violet-200 dark:border-gray-700 px-3 py-1.5 rounded-full transition"
                        >
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-purple-400 flex items-center justify-center text-xs font-black text-white">
                                {username?.charAt(0).toUpperCase() ?? 'E'}
                            </div>
                            <span className="hidden sm:inline text-sm font-medium text-gray-700 dark:text-gray-200">{username}</span>
                            <ChevronDown size={14} className="text-gray-400" />
                        </button>
                        {menuOpen && (
                            <div className="absolute right-0 top-10 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-1 min-w-36 z-50">
                                <button
                                    onClick={() => { logout(); navigate('/login') }}
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 w-full text-left transition rounded-xl"
                                >
                                    <LogOut size={14} />
                                    Cerrar sesión
                                </button>
                            </div>
                        )}
                    </div>
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
                                    ? 'border-violet-600 text-violet-600 dark:text-violet-400 dark:border-violet-400'
                                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
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
