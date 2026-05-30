import { useEffect } from 'react'
import api from '../../../shared/api/axios'

const usePushNotificaciones = () => {
    const urlBase64ToUint8Array = (base64String: string) => {
        const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
        const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
        const rawData = window.atob(base64)
        const outputArray = new Uint8Array(rawData.length)
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i)
        }
        return outputArray
    }

    useEffect(() => {
        // Listener de sonido — siempre activo independiente de la suscripción
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.tipo === 'PLAY_SOUND') {
                const audio = new Audio('/notification.mp3')
                audio.volume = 0.5
                audio.play().catch(() => {})
            }
        }
        navigator.serviceWorker.addEventListener('message', handleMessage)

        const registrar = async () => {
            try {
                if (!('serviceWorker' in navigator) || !('PushManager' in window)) return

                const registration = await navigator.serviceWorker.register('/sw.js')

                const permission = await Notification.requestPermission()
                if (permission !== 'granted') return

                const { data } = await api.get('/notificaciones/vapid-public-key')
                const publicKey = data.publicKey

                const suscripcion = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(publicKey),
                })

                await api.post('/notificaciones/push-suscripcion', suscripcion.toJSON())
            } catch (error) {
                console.error('Error registrando push notifications:', error)
            }
        }

        registrar()

        return () => {
            navigator.serviceWorker.removeEventListener('message', handleMessage)
        }
    }, [])
}

export default usePushNotificaciones
