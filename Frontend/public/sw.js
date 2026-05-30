self.addEventListener('push', (event) => {
    const data = event.data?.json() ?? {}
    const titulo = data.titulo ?? 'SICU'
    const mensaje = data.mensaje ?? ''

    event.waitUntil(
        self.registration.showNotification(titulo, {
            body: mensaje,
            icon: '/vite.svg',
            badge: '/vite.svg',
        })
    )
})

self.addEventListener('notificationclick', (event) => {
    event.notification.close()
    event.waitUntil(
        clients.openWindow('/')
    )
})
