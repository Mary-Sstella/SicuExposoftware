const notificacionRepository = require('./notificacion.repository')
const transporter = require('../../config/mailer')
const prisma = require('../../config/prisma')
const webpush = require('../../config/webpush')
const pushRepository = require('./push.repository')

const crearNotificacion = (id_estudiante, tipo, titulo, mensaje) => {
    return notificacionRepository.crearNotificacion({ id_estudiante, tipo, titulo, mensaje })
}

const enviarNotificacion = async (id_estudiante, tipo, titulo, mensaje) => {
    const notificacion = await crearNotificacion(id_estudiante, tipo, titulo, mensaje)

    const usuario = await prisma.usuarios.findFirst({
        where: { id_estudiante },
        select: { email: true },
    })

    if (usuario?.email) {
        try {
            await transporter.sendMail({
                from: process.env.GMAIL_USER,
                to: usuario.email,
                subject: titulo,
                html: `
                  <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
                    <div style="background:linear-gradient(135deg,#c9a49a,#e8c5be);padding:30px;text-align:center;">
                      <img src="https://rjchngzqifscumkibybr.supabase.co/storage/v1/object/public/assets/Sicu_banner.jpeg" width="100%" style="max-width:540px;display:block;margin:0 auto 16px;" />
                      <h2 style="margin:0;color:#ffffff;font-size:22px;">${titulo}</h2>
                    </div>
                    <div style="padding:30px;">
                      <p style="color:#7a5c58;font-size:15px;line-height:1.6;">${mensaje}</p>
                      <div style="text-align:center;margin-top:24px;">
                        <a href="${process.env.FRONTEND_URL}" style="background:linear-gradient(135deg,#c9a49a,#e8c5be);color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:25px;font-size:14px;font-weight:bold;display:inline-block;">Ir al sistema SICU →</a>
                      </div>
                    </div>
                    <div style="background:#f9f0ee;padding:16px;text-align:center;border-top:1px solid #e8d5d0;">
                      <p style="margin:0;color:#a07a76;font-size:12px;">SICU · Universidad Popular del Cesar · Comedor Universitario</p>
                    </div>
                  </div>
                `,
            })
        } catch (error) {
            console.error('Error enviando notificación por correo:', error)
        }
    }

    try {
        const suscripciones = await pushRepository.getSuscripcionesEstudiante(id_estudiante)
        for (const sus of suscripciones) {
            const pushSuscripcion = {
                endpoint: sus.endpoint,
                keys: { p256dh: sus.p256dh, auth: sus.auth },
            }
            await webpush.sendNotification(
                pushSuscripcion,
                JSON.stringify({ titulo, mensaje })
            )
        }
    } catch (err) {
        console.error('Error enviando push:', err.message)
    }

    return notificacion
}

const getNotificaciones = async (id_estudiante) => {
    const [notificaciones, no_leidas] = await Promise.all([
        notificacionRepository.getNotificacionesEstudiante(id_estudiante),
        notificacionRepository.getNoLeidas(id_estudiante),
    ])

    return { notificaciones, no_leidas }
}

const marcarLeida = (id_notificacion) => {
    return notificacionRepository.marcarLeida(id_notificacion)
}

const marcarTodasLeidas = (id_estudiante) => {
    return notificacionRepository.marcarTodasLeidas(id_estudiante)
}

const guardarSuscripcion = (id_estudiante, suscripcion) => {
    return pushRepository.guardarSuscripcion(
        id_estudiante,
        suscripcion.endpoint,
        suscripcion.keys.p256dh,
        suscripcion.keys.auth
    )
}

module.exports = {
    crearNotificacion,
    enviarNotificacion,
    getNotificaciones,
    marcarLeida,
    marcarTodasLeidas,
    guardarSuscripcion,
}
