import { useAuthStore } from "../../auth/store/authStore"
import MiTurnoHoy from "../components/MiTurnoHoy"
import HacerReserva from "../components/HacerReserva"

function EstudiantePage() {
    const { username } = useAuthStore()

    return (
        <div className="flex-1 p-8 overflow-y-auto bg-slate-100">
            <div className="mb-6">
                <h2 className="text-base font-semibold text-gray-700">Bienvenido, {username}</h2>
                <p className="text-xs text-gray-400">Aquí puedes ver tu turno y gestionar tu reserva</p>
            </div>
            <div className="flex flex-col gap-4 max-w-lg">
                <MiTurnoHoy />
                <HacerReserva />
            </div>
        </div>
    )
}

export default EstudiantePage
