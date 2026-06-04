import StudentTopbar from './StudentTopbar'
import { Outlet } from "react-router-dom"
import usePushNotificaciones from '../../../features/student/hooks/usePushNotificaciones'
import { useThemeStore } from '../../store/themeStore'

function StudentLayout() {
    usePushNotificaciones()
    const { isDark } = useThemeStore()

    return (
        <div className={`flex flex-col h-screen bg-slate-100 dark:bg-gray-950 ${isDark ? 'dark' : ''}`}>
            <StudentTopbar />
            <main className="flex-1 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    )
}

export default StudentLayout