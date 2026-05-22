import { useCallback, useEffect, useState } from 'react'
import { useAuthStore } from '../../auth/store/authStore'
import { getDiasEstudiante, getReservaActiva, getDisponibilidad, crearReserva } from '../services/estudianteService'

interface Dias {
    lunes: boolean | null
    martes: boolean | null
    miercoles: boolean | null
    jueves: boolean | null
    viernes: boolean | null
}

interface ReservaActiva {
    id_reserva: number
    fecha: string
    hora_inicio: string
    hora_fin: string
    numero_turno: number
    estado: string
}

interface RangoDisponible {
    id_configuracion: number
    hora_inicio: string
    hora_fin: string
    disponibles: number
    disponible: boolean
}


interface ReservaCreada{
    fecha: string
    hora_inicio: string
    hora_fin: string
    numero_turno: number
}

export function useHacerReserva(){
    const {id_estudiante} = useAuthStore() //manejar auteticación
    const[loading, setLoading] = useState(true) //guardar datos que cambian con el tiempo
    const [dias, setDias] = useState<Dias | null>(null)
    const [reservaActiva, setReservaActiva] = useState<ReservaActiva | null>(null)
    const [paso, setPaso] = useState(1) //muestra en que paso esta el estudiante al hacer una reserva
    const [fechaSeleccionada, setFechaSeleccionada] = useState('')
    const [disponibilidad, setDisponibilidad] = useState<RangoDisponible[]>([])
    const [reservaCreada, setReservaCreada] = useState<ReservaCreada | null>(null)
    const [error, setError] = useState('')
    const [loadingConfirmar, setLoadingConfirmar] = useState(false)

    const cargarDatos = useCallback(async()=>{ // carga dos cosas cuando el componente abre
        if(!id_estudiante) return
        setLoading(true)
        try{
            const [diasData, reservaData] = await Promise.all([
                getDiasEstudiante(id_estudiante), //tare los dias habilitados del estudiante para almorzar
                getReservaActiva(id_estudiante) //revisa si el estuidnate tiene una reserva todavia activa
            ])
            setDias(diasData)
            setReservaActiva(reservaData)
        }finally{
            setLoading(false)
        }
    }, [id_estudiante])

    useEffect(()=>{cargarDatos()}, [cargarDatos])

    const seleccionarFecha = async (fecha: string) => {
        setError('')
        setFechaSeleccionada(fecha)
        try {
            const data = await getDisponibilidad(fecha)
            setDisponibilidad(data)
            setPaso(2)
        } catch {
            setError('No se pudo cargar la disponibilidad')
        }
    }

    const confirmar = async (id_configuracion: number) => {
        if (!id_estudiante) return
        setLoadingConfirmar(true)
        setError('')
        try {
            const nueva = await crearReserva(id_estudiante, fechaSeleccionada, id_configuracion)
            setReservaCreada(nueva)
        } catch (e: unknown) {
            const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message
            setError(msg ?? 'Error al crear la reserva')
        } finally {
            setLoadingConfirmar(false)
        }
    }

    const volver = () => {
        setPaso(1) //regresa al selectror de fecha
        setFechaSeleccionada('') //borra la fecha eleguda 
        setDisponibilidad([]) //limpia los rangos horarios
        setError('')
    }

    return {
        loading, dias, reservaActiva, paso, fechaSeleccionada,
        disponibilidad, reservaCreada, error, loadingConfirmar,
        seleccionarFecha, confirmar, volver
    }

}