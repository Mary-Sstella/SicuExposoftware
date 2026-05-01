import { AlertCircle, CheckCircle, Clock, Hash } from "lucide-react";
import { useMisTurnos } from "../hooks/useMisTurnos";



function MiTurnoHoy(){
    const {turno, loading} = useMisTurnos()

    if(loading) return <p className="text-sm text-gray-400">Cargando...</p>

    if(!turno) return(
        <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col items-center gap-2">
            <AlertCircle size={32} className="text-gray-300"/>
            <p className="text-sm text-gray-400 font-medium">No tienes turnos asignados para hoy</p>
        </div>
    )

    const llego = turno.estado === 'PRESENTE'

    return(
        <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-4">
            <h3 className="text-sm font-bold text-gray-700">Mi turno de hoy</h3>

            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center shadow-md">
                    <span className="text-2xl font-black text-white">${turno.numero_turno}</span>
                </div>
                <div>
                    <div className="flex items-center gap-1 text-gray-500 text-xs mb-1">
                        <Clock size={12}/>
                        <span>{turno.hora_inicio}-{turno.hora_fin}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500 text-xs">
                        <Hash size={12}/>
                        <span>Turno Número {turno.numero_turno}</span>
                    </div>
                </div>
            </div>

            <div className={`flex items-center gap-2 px-3 py-2 rounded-xl ${llego ? 'bg-green-50' : 'bg-amber-50'}`}>
                <CheckCircle size={16} className={llego ? 'text-green-500' : 'text-amber-400' } />
                <span className={`text-xs font-semibold ${llego ? 'text-green-600' : 'text-amber-600'}`}>
                    {llego ? 'Asistencia Confirmada' : 'Asistencia Pediente'}
                </span>
            </div>
        </div>
    )
}

export default MiTurnoHoy