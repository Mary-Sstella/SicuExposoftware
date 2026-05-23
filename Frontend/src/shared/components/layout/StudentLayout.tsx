import StudentTopbar from './StudentTopbar'
import { Outlet } from "react-router-dom"

//es el contenedor general de la página del estudiante

function StudentLayout() {
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