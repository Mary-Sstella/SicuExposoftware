import StudentSidebar from './StudentSidebar'
import { Outlet } from "react-router-dom";

function StudentLayout(){
    return(
        <div className="flex h-screen bg-gradient-to-br from-pink-400 via-rose-300 to-purple-500">
            <StudentSidebar/>
            <main className="flex-1 flex flex-col overflow-hidden bg-gray-50 rounded-3xl my-3 mr-3">
                <div className="flex-1 overflow-y-auto">
                    <Outlet/>
                </div>
            </main>
        </div>
    )
}

export default StudentLayout