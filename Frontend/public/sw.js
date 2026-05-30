self.addEventListener('push', (event) => {
    console.log('[SW] Push recibido')
    const data = event.data?.json() ?? {}
    const titulo = data.titulo ?? 'SICU'
    const mensaje = data.mensaje ?? ''

    event.waitUntil(
        Promise.all([
            self.registration.showNotification(titulo, {
                body: mensaje,
                icon: '/vite.svg',
                badge: '/vite.svg',
                vibrate: [200, 100, 200],
                data: { url: '/' }
            }),
            self.clients.matchAll({ includeUncontrolled: true, type: 'window' }).then(clients => {
                console.log('[SW] Clientes encontrados:', clients.length)
                clients.forEach(client => {
                    client.postMessage({ tipo: 'PLAY_SOUND' })
                })
            })
        ])
    )
})

self.addEventListener('notificationclick', (event) => {
    event.notification.close()
    event.waitUntil(
        clients.openWindow(event.notification.data?.url ?? '/')
    )
})
