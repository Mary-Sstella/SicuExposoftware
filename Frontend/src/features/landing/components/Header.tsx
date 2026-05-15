import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../shared/constants/routes";



function Header(){
    const navigate = useNavigate()

    return(
        <header className="w-full px-10 py-5 flex items-center justify-between bg-transparent">
            <span className="text-2xl font-bold text-violet-600 tracking-wide">SICU</span>
            <div className="flex items-center gap-3">
                <button
                onClick={()=>navigate(ROUTES.INSCRIPCION)}
                className="bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition">
                    Registrarse
                </button>
            <button
            onClick={()=> navigate(ROUTES.LOGIN)}
            className="border-2 border-purple-500 text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-purple-50 transition">
                Iniciar Sesión
            </button>
        </div>
        </header>
    )
}

export default Header