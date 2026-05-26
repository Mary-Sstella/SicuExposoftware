import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../features/auth/store/authStore";


function ProtectedRoute({roles}: {roles: string[]}){
    const{token, rol} = useAuthStore()

    if(!token) return <Navigate to="/login" replace />
    if(!roles.includes(rol ?? '' )) return <Navigate to="/login" replace/>

    return <Outlet/>
}

export default ProtectedRoute

