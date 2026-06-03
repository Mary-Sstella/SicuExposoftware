import { useState, useEffect, useCallback, useRef } from 'react'
import { getNotificaciones, marcarLeida, marcarTodasLeidas } from '../services/notificacionesService'

interface Notificacion {
    id_notificacion: number
    tipo: string
    titulo: string
    mensaje: string
    leida: boolean
    fecha_creacion: string
}

const useNotificaciones = () => {
    const [notificaciones, setNotificaciones] = useState<Notificacion[]>([])
    const [noLeidas, setNoLeidas] = useState<number>(0)
    const [loading, setLoading] = useState<boolean>(false)
    const prevNoLeidas = useRef<number>(-1)

    const fetchData = useCallback(async () => {
        try {
            setLoading(true)
            const data = await getNotificaciones()
            setNotificaciones(data.notificaciones)
            setNoLeidas(data.no_leidas)
            if (data.no_leidas > prevNoLeidas.current && prevNoLeidas.current >= 0) {
                const audio = new Audio('/notification.mp3')
                audio.volume = 0.5
                audio.play().catch((err) => console.error('Error reproduciendo sonido:', err))
            }
            prevNoLeidas.current = data.no_leidas
        } catch (error) {
            console.error('Error al obtener notificaciones:', error)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchData()
        const intervalo = setInterval(fetchData, 30000)
        return () => clearInterval(intervalo)
    }, [fetchData])

    const leerUna = async (id: number) => {
        await marcarLeida(id)
        setNotificaciones(prev =>
            prev.map(n => n.id_notificacion === id ? { ...n, leida: true } : n)
        )
        setNoLeidas(prev => Math.max(0, prev - 1))
    }

    const leerTodas = async () => {
        await marcarTodasLeidas()
        setNotificaciones(prev => prev.map(n => ({ ...n, leida: true })))
        setNoLeidas(0)
    }

    return { notificaciones, noLeidas, loading, leerUna, leerTodas, refetch: fetchData }
}

export default useNotificaciones
