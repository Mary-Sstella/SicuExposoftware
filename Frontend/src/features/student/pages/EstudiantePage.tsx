import { useAuthStore } from "../../auth/store/authStore";
import MisReservas from "../components/MisReservas";
import MiTurnoHoy from "../components/MiTurnoHoy";


function EstudiantePage(){
    const {username} = useAuthStore()

    return(
        <div className="flex-1 p-8 overflow-y-auto">
            <div className="mb-6">
                <h2 className="text-base font-semibold text-gray-700">Bienvenido,{username}</h2>
                <p className="text-xs text-gray-400">Aqui puedes ver tu turno y reserva del dia</p>
            </div>
            <div className="flex flex-col gap-4 max-w-lg">
                <MiTurnoHoy/>
                <MisReservas/>
            </div>
        </div>
    )
}

export default EstudiantePage