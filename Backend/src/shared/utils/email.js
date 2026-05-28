const transporter = require('../../config/mailer');

const enviarCredenciales = async ({ nombre, correo, correoInstitucional, diasAprobados, esNuevo }) => {
    const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background-color:#f9f0ee;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:30px 0;">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

          <!-- Banner -->
          <tr>
            <td>
              <img src="https://rjchngzqifscumkibybr.supabase.co/storage/v1/object/public/assets/Sicu_banner.jpeg" width="600" style="display:block;width:100%;max-width:600px;" alt="Comedor SICU" />
            </td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#c9a49a,#e8c5be);padding:40px 30px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:32px;letter-spacing:4px;">COMEDOR SICU</h1>
              <p style="margin:8px 0 0;color:#fff8f7;font-size:14px;">Alimentamos tu día, impulsamos tu futuro</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 30px;">
              <p style="font-size:22px;color:#5a3e3a;margin:0 0 16px;">Hola, <strong>${nombre}</strong> 👋</p>

              ${esNuevo ? `
              <p style="color:#7a5c58;font-size:15px;line-height:1.6;">Tu solicitud de inscripción al Comedor SICU ha sido <strong style="color:#c9a49a;">aprobada</strong>. A continuación encontrarás tus credenciales de acceso.</p>
              ` : `
              <p style="color:#7a5c58;font-size:15px;line-height:1.6;">Tu cuenta en el Comedor SICU ha sido <strong style="color:#c9a49a;">reactivada</strong> para el nuevo semestre. Tus credenciales siguen siendo las mismas.</p>
              `}

              <!-- Credenciales -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f0ee;border-radius:8px;margin:24px 0;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 12px;color:#5a3e3a;font-size:13px;text-transform:uppercase;letter-spacing:1px;font-weight:bold;">Tus credenciales</p>
                    <p style="margin:0 0 8px;color:#7a5c58;font-size:15px;">📧 <strong>Correo:</strong> ${correoInstitucional}</p>
                    <p style="margin:0;color:#7a5c58;font-size:15px;">🔑 <strong>Contraseña:</strong> Tu número de cédula</p>
                  </td>
                </tr>
              </table>

              <!-- Días aprobados -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f0ee;border-radius:8px;margin:0 0 24px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 12px;color:#5a3e3a;font-size:13px;text-transform:uppercase;letter-spacing:1px;font-weight:bold;">Días aprobados</p>
                    <p style="margin:0;color:#7a5c58;font-size:15px;">📅 ${diasAprobados.join(', ')}</p>
                  </td>
                </tr>
              </table>

              ${esNuevo ? `<p style="color:#a07a76;font-size:13px;font-style:italic;">Por seguridad te recomendamos cambiar tu contraseña al ingresar por primera vez.</p>` : ''}

              <!-- Botón -->
              <div style="text-align:center;margin:24px 0;">
                <a href="${process.env.FRONTEND_URL}" style="background:linear-gradient(135deg,#c9a49a,#e8c5be);color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:25px;font-size:15px;font-weight:bold;display:inline-block;">Ingresar al sistema →</a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9f0ee;padding:20px 30px;text-align:center;border-top:1px solid #e8d5d0;">
              <p style="margin:0;color:#a07a76;font-size:12px;">SICU · Universidad Popular del Cesar · Comedor Universitario</p>
              <p style="margin:4px 0 0;color:#c9a49a;font-size:11px;">Este es un correo automático, por favor no respondas a este mensaje.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    try {
        await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: correo,
            subject: esNuevo ? 'Bienvenido al Sistema SICU - Tus credenciales' : 'SICU - Cuenta reactivada',
            html,
        });
    } catch (error) {
        console.error('[EMAIL] Error al enviar credenciales:', error.message);
    }
};

const enviarRespuestaSoporte = async ({ nombre, correo, asunto, respuesta }) => {
    const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background-color:#f9f0ee;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:30px 0;">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

          <!-- Banner -->
          <tr>
            <td>
              <img src="https://rjchngzqifscumkibybr.supabase.co/storage/v1/object/public/assets/Sicu_banner.jpeg" width="600" style="display:block;width:100%;max-width:600px;" alt="Comedor SICU" />
            </td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#c9a49a,#e8c5be);padding:40px 30px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:32px;letter-spacing:4px;">COMEDOR SICU</h1>
              <p style="margin:8px 0 0;color:#fff8f7;font-size:14px;">Respuesta a tu solicitud de soporte</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 30px;">
              <p style="font-size:22px;color:#5a3e3a;margin:0 0 16px;">Hola, <strong>${nombre}</strong> 👋</p>
              <p style="color:#7a5c58;font-size:15px;line-height:1.6;">Hemos revisado tu solicitud y tenemos una respuesta para ti.</p>

              <!-- Asunto -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f0ee;border-radius:8px;margin:24px 0 16px;">
                <tr>
                  <td style="padding:16px 24px;">
                    <p style="margin:0 0 4px;color:#5a3e3a;font-size:13px;text-transform:uppercase;letter-spacing:1px;font-weight:bold;">Tu solicitud</p>
                    <p style="margin:0;color:#7a5c58;font-size:15px;">${asunto}</p>
                  </td>
                </tr>
              </table>

              <!-- Respuesta -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f0ee;border-radius:8px;margin:0 0 24px;">
                <tr>
                  <td style="padding:16px 24px;">
                    <p style="margin:0 0 4px;color:#5a3e3a;font-size:13px;text-transform:uppercase;letter-spacing:1px;font-weight:bold;">Respuesta del equipo SICU</p>
                    <p style="margin:0;color:#7a5c58;font-size:15px;line-height:1.6;">${respuesta}</p>
                  </td>
                </tr>
              </table>

              <p style="color:#a07a76;font-size:13px;">Si tienes más dudas puedes enviarnos otro mensaje desde la página principal del sistema.</p>

              <!-- Botón -->
              <div style="text-align:center;margin:24px 0;">
                <a href="${process.env.FRONTEND_URL}" style="background:linear-gradient(135deg,#c9a49a,#e8c5be);color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:25px;font-size:15px;font-weight:bold;display:inline-block;">Ir al sistema SICU →</a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9f0ee;padding:20px 30px;text-align:center;border-top:1px solid #e8d5d0;">
              <p style="margin:0;color:#a07a76;font-size:12px;">SICU · Universidad Popular del Cesar · Comedor Universitario</p>
              <p style="margin:4px 0 0;color:#c9a49a;font-size:11px;">Este es un correo automático, por favor no respondas a este mensaje.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    try {
        await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: correo,
            subject: 'SICU - Respuesta a tu solicitud de soporte',
            html,
        });
    } catch (error) {
        console.error('[EMAIL] Error al enviar respuesta de soporte:', error.message);
    }
};

module.exports = {
    enviarCredenciales,
    enviarRespuestaSoporte,
};
