import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
/*se hace el MainLayout para que el sidebar este en todo el sitio
pero no se pone en el main para evitar que aparezaca en el login por ejemplo*/

function MainLayout(){
    return(
        <div className="flex h-screen bg-gray-50">
            <Sidebar/>
            <main className="flex h-screen bg-gray-50">
                <Outlet/>
            </main>
        </div>
    )
}

export default MainLayout