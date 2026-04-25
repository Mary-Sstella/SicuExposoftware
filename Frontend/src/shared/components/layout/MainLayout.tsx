/*se hace el MainLayout para que el sidebar este en todo el sitio
pero no se pone en el main para evitar que aparezaca en el login por ejemplo*/

import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

function MainLayout(){
    return(
        <div className="flex h-screen bg-violet-500">
            <Sidebar/>
            <main className="flex-1 flex overflow-hidden bg-gray-50 rounded-3xl my-3 mr-3">
                <Outlet/>
            </main>
        </div>
    )
}

export default MainLayout
