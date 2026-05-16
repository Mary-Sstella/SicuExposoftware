import { UserCircle2 } from "lucide-react"
import { useLocation } from "react-router-dom"


const routeTitles: Record<string, string>={
    '/dashboard': 'Dashboard', 
    '/estudiantes': 'Estudiantes',
    '/asistencia': 'Asistencia',
    '/turnos':'Turnos',
    '/cartera': 'Cartera',
    '/comentarios': 'Comentarios',
    '/estadisticas': 'Estadisticas',
    '/solicitudes': 'Solicitudes',
}

function Topbar(){
    const{pathname} = useLocation()
    const title = routeTitles[pathname] ?? 'Dashboard'
    
    return(
        <div className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-200">
            <h1 className="text-lg font-bold text-gray-800">{title}</h1>
            <div className="flex items-center gap-2 bg-gray-200 px-3 py-2 rounded-xl">
                <UserCircle2 size={34} className="text-violet-500"/>
                <div>
                    <p className="text-sm font-semibold text-gray-700 leading-none">Administrador</p>
                    <p className="text-xs text-gray-400">Admin</p>
                </div>
            </div>
        </div>
    )
}

export default Topbar