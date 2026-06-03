import StudentTopbar from './StudentTopbar'
import { Outlet } from "react-router-dom"
import usePushNotificaciones from '../../../features/student/hooks/usePushNotificaciones'

function StudentLayout() {
    usePushNotificaciones()
    return (
        <div className="flex flex-col h-screen bg-slate-100">
            <StudentTopbar />
            <main className="flex-1 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    )
}

export default StudentLayout