import { useRef, useEffect } from 'react'
import { UserCircle2, Sun, Moon, LogOut } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { useThemeStore } from '../../store/themeStore'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../../features/auth/store/authStore'


const routeTitles: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/estudiantes': 'Estudiantes',
    '/asistencia': 'Asistencia',
    '/turnos': 'Turnos',
    '/cartera': 'Cartera',
    '/buzon': 'Buzón',
    '/estadisticas': 'Estadísticas',
    '/solicitudes': 'Solicitudes',
    '/configuracion': 'Configuración',
}

function Topbar() {
    const { pathname } = useLocation()
    const title = routeTitles[pathname] ?? 'Dashboard'
    const ref = useRef<HTMLDivElement>(null)
    const { isDark, toggleTheme } = useThemeStore()
    const navigate = useNavigate()
    const { logout } = useAuthStore()


    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {}
        }
        document.addEventListener('mousedown', handleClick)
        return () => document.removeEventListener('mousedown', handleClick)
    }, [])

    return (
        <div className="flex items-center justify-between px-4 md:px-8 py-3 md:py-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
            <h1 className="text-lg font-bold text-gray-800 dark:text-white">{title}</h1>
            <div className="flex items-center gap-3">

                {/* Toggle oscuro/claro */}
                <button
                    onClick={toggleTheme}
                    className={`relative flex items-center w-14 h-7 rounded-full p-1 transition-colors duration-300 ${
                        isDark ? 'bg-violet-600' : 'bg-gray-200'
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

                {/* Avatar */}
                <div ref={ref} className="relative">
                    <button className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-2 rounded-xl transition-colors">
                        <UserCircle2 size={34} className="text-violet-500" />
                        <div className="text-left">
                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 leading-none hidden sm:block">Administrador</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 hidden sm:block">Admin</p>
                        </div>
                    </button>
                </div>

                {/* Cerrar sesión — solo mobile */}
                <button
                    onClick={() => { logout(); navigate('/login') }}
                    className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-all"
                    title="Cerrar sesión"
                >
                    <LogOut size={18} />
                </button>

            </div>
        </div>
    )
}

export default Topbar
