const transporter = require('../../config/mailer');

const btnStyle = 'background-color:#c9a49a;color:#ffffff;text-decoration:none;padding:14px 32px;font-size:15px;font-weight:bold;display:inline-block;font-family:Arial,sans-serif;';

const plantillaBase = (contenido) => `<!DOCTYPE html>
<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<!--[if mso]>
<noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
<![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#f9f0ee;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f9f0ee;">
  <tr>
    <td align="center" style="padding:30px 0;">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;max-width:600px;">

        <!-- Banner -->
        <tr>
          <td bgcolor="#c9a49a" style="background-color:#c9a49a;">
            <img src="https://rjchngzqifscumkibybr.supabase.co/storage/v1/object/public/assets/Sicu_banner.jpeg" width="600" style="display:block;width:100%;max-width:600px;" alt="Comedor SICU" />
          </td>
        </tr>

        <!-- Header -->
        <tr>
          <td bgcolor="#c9a49a" style="padding:40px 30px;text-align:center;background-color:#c9a49a;">
            <h1 style="margin:0;color:#ffffff;font-size:28px;letter-spacing:4px;font-family:Arial,sans-serif;">COMEDOR SICU</h1>
            <p style="margin:8px 0 0;color:#fff8f7;font-size:14px;font-family:Arial,sans-serif;">Alimentamos tu dia, impulsamos tu futuro</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:40px 30px;background-color:#ffffff;">
            ${contenido}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td bgcolor="#f9f0ee" style="background-color:#f9f0ee;padding:20px 30px;text-align:center;border-top:1px solid #e8d5d0;">
            <p style="margin:0;color:#a07a76;font-size:12px;font-family:Arial,sans-serif;">SICU - Universidad Popular del Cesar - Comedor Universitario</p>
            <p style="margin:4px 0 0;color:#c9a49a;font-size:11px;font-family:Arial,sans-serif;">Este es un correo automatico, por favor no respondas a este mensaje.</p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>`;

const cajaInfo = (titulo, contenido) => `
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:16px 0;">
  <tr>
    <td bgcolor="#f9f0ee" style="background-color:#f9f0ee;padding:20px 24px;">
      <p style="margin:0 0 8px;color:#5a3e3a;font-size:13px;text-transform:uppercase;letter-spacing:1px;font-weight:bold;font-family:Arial,sans-serif;">${titulo}</p>
      ${contenido}
    </td>
  </tr>
</table>`;

const boton = (texto, url) => `
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0;">
  <tr>
    <td align="center">
      <!--[if mso]>
      <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${url}" style="height:50px;v-text-anchor:middle;width:220px;" arcsize="50%" strokecolor="#c9a49a" fillcolor="#c9a49a">
        <w:anchorlock/>
        <center style="color:#ffffff;font-family:Arial,sans-serif;font-size:15px;font-weight:bold;">${texto}</center>
      </v:roundrect>
      <![endif]-->
      <!--[if !mso]><!-->
      <a href="${url}" style="${btnStyle}">${texto}</a>
      <!--<![endif]-->
    </td>
  </tr>
</table>`;

const enviarCredenciales = async ({ nombre, correo, correoInstitucional, diasAprobados, esNuevo }) => {
    const contenido = `
      <p style="font-size:20px;color:#5a3e3a;margin:0 0 16px;font-family:Arial,sans-serif;">Hola, <strong>${nombre}</strong></p>
      <p style="color:#7a5c58;font-size:15px;line-height:1.6;font-family:Arial,sans-serif;">
        ${esNuevo
          ? 'Tu solicitud de inscripcion al Comedor SICU ha sido <strong style="color:#c9a49a;">aprobada</strong>. A continuacion encontraras tus credenciales de acceso.'
          : 'Tu cuenta en el Comedor SICU ha sido <strong style="color:#c9a49a;">reactivada</strong> para el nuevo semestre. Tus credenciales siguen siendo las mismas.'}
      </p>
      ${cajaInfo('Tus credenciales', `
        <p style="margin:0 0 8px;color:#7a5c58;font-size:15px;font-family:Arial,sans-serif;"><strong>Correo:</strong> ${correoInstitucional}</p>
        <p style="margin:0;color:#7a5c58;font-size:15px;font-family:Arial,sans-serif;"><strong>Contrasena:</strong> Tu numero de cedula</p>
      `)}
      ${cajaInfo('Dias aprobados', `
        <p style="margin:0;color:#7a5c58;font-size:15px;font-family:Arial,sans-serif;">${diasAprobados.join(', ')}</p>
      `)}
      ${esNuevo ? `<p style="color:#a07a76;font-size:13px;font-style:italic;font-family:Arial,sans-serif;">Por seguridad te recomendamos cambiar tu contrasena al ingresar por primera vez.</p>` : ''}
      ${boton('Ingresar al sistema', process.env.FRONTEND_URL)}
    `;

    try {
        await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: correo,
            subject: esNuevo ? 'Bienvenido al Sistema SICU - Tus credenciales' : 'SICU - Cuenta reactivada',
            html: plantillaBase(contenido),
        });
    } catch (error) {
        console.error('[EMAIL] Error al enviar credenciales:', error.message);
    }
};

const enviarRespuestaSoporte = async ({ nombre, correo, asunto, respuesta }) => {
    const contenido = `
      <p style="font-size:20px;color:#5a3e3a;margin:0 0 16px;font-family:Arial,sans-serif;">Hola, <strong>${nombre}</strong></p>
      <p style="color:#7a5c58;font-size:15px;line-height:1.6;font-family:Arial,sans-serif;">Hemos revisado tu solicitud y tenemos una respuesta para ti.</p>
      ${cajaInfo('Tu solicitud', `
        <p style="margin:0;color:#7a5c58;font-size:15px;font-family:Arial,sans-serif;">${asunto}</p>
      `)}
      ${cajaInfo('Respuesta del equipo SICU', `
        <p style="margin:0;color:#7a5c58;font-size:15px;line-height:1.6;font-family:Arial,sans-serif;">${respuesta}</p>
      `)}
      <p style="color:#a07a76;font-size:13px;font-family:Arial,sans-serif;">Si tienes mas dudas puedes enviarnos otro mensaje desde la pagina principal del sistema.</p>
      ${boton('Ir al sistema SICU', process.env.FRONTEND_URL)}
    `;

    try {
        await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: correo,
            subject: 'SICU - Respuesta a tu solicitud de soporte',
            html: plantillaBase(contenido),
        });
    } catch (error) {
        console.error('[EMAIL] Error al enviar respuesta de soporte:', error.message);
    }
};

module.exports = {
    enviarCredenciales,
    enviarRespuestaSoporte,
};
