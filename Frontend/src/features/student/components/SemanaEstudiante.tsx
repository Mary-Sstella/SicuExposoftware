import { useEffect, useState } from 'react'
import { useAuthStore } from '../../auth/store/authStore'
import { getFechasPagadas, getHistorialEstudiante } from '../services/estudianteService'

interface Registro {
    fecha: string
    numero_turno: number
    hora_inicio: string
    hora_fin: string
    estado: string
}

const DIAS_LABEL = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

function getSemanaActual(): Date[] {
    const hoy = new Date()
    const dia = hoy.getDay()
    const lunes = new Date(hoy)
    lunes.setDate(hoy.getDate() - (dia === 0 ? 6 : dia - 1))
    lunes.setHours(0, 0, 0, 0)
    return Array.from({ length: 5 }, (_, i) => {
        const d = new Date(lunes)
        d.setDate(lunes.getDate() + i)
        return d
    })
}

function getNumeroSemana(d: Date): number {
    const fecha = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
    const diaSemana = fecha.getUTCDay() || 7
    fecha.setUTCDate(fecha.getUTCDate() + 4 - diaSemana)
    const añoInicio = new Date(Date.UTC(fecha.getUTCFullYear(), 0, 1))
    return Math.ceil(((fecha.getTime() - añoInicio.getTime()) / 86400000 + 1) / 7)
}

function toISO(d: Date) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function SemanaEstudiante() {
    const { id_estudiante } = useAuthStore()
    const [fechasPagadas, setFechasPagadas] = useState<string[]>([])
    const [historial, setHistorial] = useState<Registro[]>([])

    useEffect(() => {
        if (!id_estudiante) return
        getFechasPagadas(id_estudiante).then(setFechasPagadas)
        getHistorialEstudiante(id_estudiante).then(setHistorial)
    }, [id_estudiante])

    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)
    const diasSemana = getSemanaActual()
    const numSemana = getNumeroSemana(hoy)
    const lunes = diasSemana[0]
    const viernes = diasSemana[4]
    const rangoLabel = `${lunes.getDate()}–${viernes.getDate()} ${MESES[viernes.getMonth()]} · sem ${numSemana}`

    const historialMap = Object.fromEntries(
        historial.map(r => [r.fecha.split('T')[0], r])
    )

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-bold text-gray-800">Tu semana</p>
                <span className="text-xs text-gray-400 font-medium">{rangoLabel}</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
                {diasSemana.map(dia => {
                    const iso = toISO(dia)
                    const esHoy = dia.getTime() === hoy.getTime()
                    const esPasado = dia < hoy
                    const registro = historialMap[iso]
                    const pagado = fechasPagadas.includes(iso)

                    let statusText = 'Sin reserva'
                    let statusColor = esHoy ? 'text-white/50' : 'text-gray-400'
                    let dotColor = 'bg-gray-200'
                    let subText = ''

                    if (registro) {
                        if (registro.estado === 'ENTREGADA') {
                            statusText = `#${registro.numero_turno}`
                            statusColor = esHoy ? 'text-green-200' : 'text-green-600'
                            dotColor = 'bg-green-400'
                            subText = registro.hora_inicio?.slice(0, 5) ?? ''
                        } else if (registro.estado === 'AUSENTE') {
                            statusText = 'Ausente'
                            statusColor = esHoy ? 'text-red-200' : 'text-red-400'
                            dotColor = 'bg-red-400'
                            subText = registro.hora_inicio?.slice(0, 5) ?? ''
                        } else if (registro.estado === 'PENDIENTE') {
                            statusText = `#${registro.numero_turno}`
                            statusColor = esHoy ? 'text-amber-200' : 'text-amber-500'
                            dotColor = 'bg-amber-400'
                            subText = registro.hora_inicio?.slice(0, 5) ?? ''
                        } else if (registro.estado === 'CANCELADA') {
                            statusText = 'Cancelada'
                            statusColor = esHoy ? 'text-gray-200' : 'text-gray-400'
                            dotColor = 'bg-gray-300'
                            subText = registro.hora_inicio?.slice(0, 5) ?? ''
                        }
            
                    } else if (pagado && !esPasado) {
                        statusText = 'Pagado'
                        statusColor = esHoy ? 'text-violet-200' : 'text-violet-500'
                        dotColor = 'bg-violet-400'
                    }

                    return (
                        <div key={iso} className={`rounded-2xl p-3 flex flex-col gap-1 ${esHoy ? 'bg-violet-600' : 'bg-gray-50'}`}>
                            <div className="flex items-center justify-between">
                                <p className={`text-[10px] font-bold uppercase tracking-wide ${esHoy ? 'text-white/70' : 'text-gray-400'}`}>
                                    {DIAS_LABEL[dia.getDay()]}
                                </p>
                                <div className={`w-1.5 h-1.5 rounded-full ${esHoy ? 'bg-white/40' : dotColor}`} />
                            </div>
                            <p className={`text-2xl font-black leading-none ${esHoy ? 'text-white' : 'text-gray-800'}`}>
                                {dia.getDate()}
                            </p>
                            <p className={`text-[10px] font-semibold mt-0.5 ${statusColor}`}>{statusText}</p>
                            {subText && (
                                <p className={`text-[9px] ${esHoy ? 'text-white/40' : 'text-gray-400'}`}>{subText}</p>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default SemanaEstudiante
