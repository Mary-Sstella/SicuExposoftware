import { useEffect, useState } from 'react'
import api from '../../../shared/api/axios'

// Datos de un turno individual que devuelve el backend
interface TurnoInfo {
    numero_turno: number
    nombre_estudiante: string
    hora_inicio: string
    hora_fin: string
}

interface TurneroData {
    turno_actual: TurnoInfo | null // Turno que se está atendiendo ahora
    siguiente: TurnoInfo | null
}

function TurneroPage() {
    // Turno que se está atendiendo ahora
    const [data, setData] = useState<TurneroData>({ turno_actual: null, siguiente: null })
    // Estado del reloj en tiempo real, se actualiza cada segundo
    const [hora, setHora] = useState(new Date())
    // Consulta el backend para obtener los turnos más recientes
    const fetchTurnero = () => {
        api.get('/turnos/turnero')
            .then(res => setData(res.data))
            .catch(() => {})
    }

    // Refresca los turnos cada 4 segundos para mantener la pantalla actualizada
    useEffect(() => {
        fetchTurnero()
        const pollInterval = setInterval(fetchTurnero, 4000)
        const clockInterval = setInterval(() => setHora(new Date()), 1000)
        // Limpia ambos intervalos al desmontar el componente para evitar memory leaks
        return () => {
            clearInterval(pollInterval)
            clearInterval(clockInterval)
        }
    }, [])

    return (
        <div className="h-screen w-screen bg-violet-100 flex flex-col items-center justify-center gap-10 select-none overflow-hidden">

            <p className="text-purple-600 text-2xl font-light tracking-widest">
                {hora.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </p>

            {data.turno_actual ? (
                <div className="flex flex-col items-center gap-4">
                    <p className="text-purple-600 text-lg font-semibold uppercase tracking-[0.3em]">Turno actual</p>
                    <div className="bg-white rounded-3xl px-24 py-10 flex flex-col items-center shadow-lg border border-violet-200">
                        <span className="text-purple-600 font-black" style={{ fontSize: '10rem', lineHeight: 1 }}>
                            {String(data.turno_actual.numero_turno).padStart(3, '0')}
                        </span>
                    </div>
                    <p className="text-purple-600 text-4xl font-bold mt-2">{data.turno_actual.nombre_estudiante}</p>
                    <p className="text-purple-400 text-xl">{data.turno_actual.hora_inicio} – {data.turno_actual.hora_fin}</p>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-4">
                    <p className="text-purple-600 text-lg font-semibold uppercase tracking-[0.3em]">Turno actual</p>
                    <div className="bg-white rounded-3xl px-24 py-10 shadow-lg border border-violet-200">
                        <span className="text-purple-600 font-black" style={{ fontSize: '10rem', lineHeight: 1 }}>—</span>
                    </div>
                    <p className="text-purple-600 text-2xl">Sin turnos pendientes</p>
                </div>
            )}

            <div className="w-72 h-px bg-violet-300" />

            <div className="flex flex-col items-center gap-2">
                <p className="text-purple-600 text-sm font-semibold uppercase tracking-[0.3em]">Próximo</p>
                {data.siguiente ? (
                    <>
                        <p className="text-purple-600 text-5xl font-bold">
                            #{String(data.siguiente.numero_turno).padStart(3, '0')}
                        </p>
                        <p className="text-purple-600 text-2xl">{data.siguiente.nombre_estudiante}</p>
                    </>
                ) : (
                    <p className="text-purple-600 text-3xl">-</p>
                )}
            </div>
        </div>
    )
}

export default TurneroPage
