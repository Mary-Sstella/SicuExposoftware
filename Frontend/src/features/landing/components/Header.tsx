import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ROUTES } from "../../../shared/constants/routes";
import api from "../../../shared/api/axios";

function Header(){
    const navigate = useNavigate()
    const [registroActivo, setRegistroActivo] = useState<boolean | null>(null)

    useEffect(() => {
        api.get('/configuracion-formulario')
            .then(res => setRegistroActivo(res.data.activo))
            .catch(() => setRegistroActivo(false))
    }, [])

    return(
        <header className="w-full px-10 py-5 flex items-center justify-between bg-transparent">
            <span className="text-2xl font-bold text-violet-600 tracking-wide">SICU</span>
            <div className="flex items-center gap-3">
                <button
                    onClick={() => registroActivo && navigate(ROUTES.INSCRIPCION)}
                    disabled={!registroActivo}
                    title={!registroActivo ? 'El registro está cerrado en este momento' : undefined}
                    className={`px-6 py-2 rounded-lg font-semibold transition ${
                        registroActivo
                            ? 'bg-gradient-to-r from-violet-600 to-violet-500 text-white hover:opacity-90 cursor-pointer'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}>
                    Registrarse
                </button>
                <button
                    onClick={() => navigate(ROUTES.LOGIN)}
                    className="border-2 border-violet-500 text-violet-600 px-6 py-2 rounded-lg font-semibold hover:bg-violet-50 transition">
                    Iniciar Sesión
                </button>
            </div>
        </header>
    )
}

export default Header