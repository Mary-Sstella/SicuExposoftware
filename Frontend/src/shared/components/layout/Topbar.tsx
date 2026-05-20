import { useState, useRef, useEffect } from 'react'
import { UserCircle2, Settings, LogOut} from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../../features/auth/store/authStore'
import { ROUTES } from '../../constants/routes'

const routeTitles: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/estudiantes': 'Estudiantes',
    '/asistencia': 'Asistencia',
    '/turnos': 'Turnos',
    '/cartera': 'Cartera',
    '/comentarios': 'Comentarios',
    '/estadisticas': 'Estadísticas',
    '/solicitudes': 'Solicitudes',
    '/configuracion': 'Configuración',
}

function Topbar() {
    const { pathname } = useLocation()
    const title = routeTitles[pathname] ?? 'Dashboard'
    const [abierto, setAbierto] = useState(false)
    const ref = useRef<HTMLDivElement>(null)
    const navigate = useNavigate()
    const { logout } = useAuthStore()

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setAbierto(false)
            }
        }
        document.addEventListener('mousedown', handleClick)
        return () => document.removeEventListener('mousedown', handleClick)
    }, [])

    return (
        <div className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-200">
            <h1 className="text-lg font-bold text-gray-800">{title}</h1>
            <div ref={ref} className="relative">
                <button
                    onClick={() => setAbierto(a => !a)}
                    className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-xl transition-colors"
                >
                    <UserCircle2 size={34} className="text-violet-500" />
                    <div className="text-left">
                        <p className="text-sm font-semibold text-gray-700 leading-none">Administrador</p>
                        <p className="text-xs text-gray-400">Admin</p>
                    </div>
                </button>

                {abierto && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-lg border border-gray-100 py-1.5 z-50">
                        <button
                            onClick={() => { navigate(ROUTES.CONFIGURACION); setAbierto(false) }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                            <Settings size={16} className="text-violet-500" />
                            Configuración
                        </button>
                        <div className="border-t border-gray-100 my-1" />
                        <button
                            onClick={() => { logout(); navigate(ROUTES.LOGIN) }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-50 transition-colors"
                        >
                            <LogOut size={16} />
                            Cerrar sesión
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Topbar
