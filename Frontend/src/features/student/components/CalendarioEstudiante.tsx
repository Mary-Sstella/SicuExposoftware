import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useAuthStore } from '../../auth/store/authStore'
import { getHistorialEstudiante, getFechasPagadas } from '../services/estudianteService'

interface Registro {
    fecha: string
    estado: string
}

const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
const DIAS_SEMANA = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb']

const colorDot: Record<string, string> = {
    ENTREGADA: 'bg-green-500',
    PENDIENTE: 'bg-amber-400',
    AUSENTE: 'bg-red-400',
    PAGADO: 'bg-violet-400',
}

function CalendarioEstudiante() {
    const { id_estudiante } = useAuthStore()
    const [registros, setRegistros] = useState<Registro[]>([])
    const [fechasPagadas, setFechasPagadas] = useState<string[]>([])
    const hoyReal = new Date()
    const [mes, setMes] = useState(hoyReal.getMonth())
    const [anio, setAnio] = useState(hoyReal.getFullYear())

    useEffect(() => {
        if (!id_estudiante) return
        getHistorialEstudiante(id_estudiante).then(setRegistros)
        getFechasPagadas(id_estudiante).then(setFechasPagadas)
    }, [id_estudiante])

    const diasMarcados: Record<string, string> = {}
    fechasPagadas.forEach(f => { diasMarcados[f] = 'PAGADO' })
    registros.forEach(r => {
        const d = r.fecha.split('T')[0]
        diasMarcados[d] = r.estado
    })

    const primerDia = new Date(anio, mes, 1).getDay()
    const diasEnMes = new Date(anio, mes + 1, 0).getDate()
    const celdas: (number | null)[] = [
        ...Array(primerDia).fill(null),
        ...Array.from({ length: diasEnMes }, (_, i) => i + 1)
    ]

    const moverMes = (dir: number) => {
        const d = new Date(anio, mes + dir, 1)
        setMes(d.getMonth())
        setAnio(d.getFullYear())
    }

    return (
        <div className="bg-white border border-gray-200 shadow-md rounded-2xl p-4">
            <div className="flex items-center justify-between mb-4">
                <button onClick={() => moverMes(-1)} className="p-1.5 rounded-lg hover:bg-gray-100 transition">
                    <ChevronLeft size={16} className="text-gray-500" />
                </button>
                <h3 className="text-sm font-bold text-gray-700">{MESES[mes]} {anio}</h3>
                <button onClick={() => moverMes(1)} className="p-1.5 rounded-lg hover:bg-gray-100 transition">
                    <ChevronRight size={16} className="text-gray-500" />
                </button>
            </div>

            <div className="grid grid-cols-7 mb-1">
                {DIAS_SEMANA.map(d => (
                    <div key={d} className="text-center text-xs text-gray-400 font-medium py-1">{d}</div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-y-1">
                {celdas.map((dia, i) => {
                    if (!dia) return <div key={i} />
                    const key = `${anio}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`
                    const estado = diasMarcados[key]
                    const esHoy =
                        hoyReal.getFullYear() === anio &&
                        hoyReal.getMonth() === mes &&
                        hoyReal.getDate() === dia
                    return (
                        <div key={i} className="flex flex-col items-center py-0.5">
                            <span className={`w-7 h-7 flex items-center justify-center text-xs rounded-full font-medium ${
                                esHoy ? 'bg-violet-100 text-violet-600 font-bold' : 'text-gray-600'
                            }`}>
                                {dia}
                            </span>
                            {estado && (
                                <div className={`w-1.5 h-1.5 rounded-full mt-0.5 ${colorDot[estado] ?? 'bg-gray-300'}`} />
                            )}
                        </div>
                    )
                })}
            </div>

            <div className="flex gap-3 mt-4 pt-3 border-t border-gray-100 flex-wrap">
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-violet-400" />
                    <span className="text-xs text-gray-400">Pagado</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-amber-400" />
                    <span className="text-xs text-gray-400">Reserva</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-xs text-gray-400">Asistió</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-400" />
                    <span className="text-xs text-gray-400">Ausente</span>
                </div>
            </div>
        </div>
    )
}

export default CalendarioEstudiante
