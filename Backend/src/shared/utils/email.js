const transporter = require('../../config/mailer');

const enviarCredenciales = async ({ nombre, correo, diasAprobados, esNuevo }) => {
    const dias = diasAprobados.join(', ');

    const html = esNuevo
        ? `
            <h2>Bienvenido al Sistema SICU</h2>
            <p>Hola <strong>${nombre}</strong>, tu solicitud ha sido aprobada.</p>
            <p>Tus credenciales de acceso son:</p>
            <ul>
                <li><strong>Correo:</strong> ${correo}</li>
                <li><strong>Contraseña:</strong> tu número de cédula (contraseña inicial)</li>
            </ul>
            <p><strong>Días aprobados:</strong> ${dias}</p>
            <p>Por seguridad te recomendamos cambiar tu contraseña al ingresar.</p>
        `
        : `
            <h2>SICU - Cuenta reactivada</h2>
            <p>Hola <strong>${nombre}</strong>, tu cuenta ha sido reactivada.</p>
            <p>Tus credenciales siguen siendo las mismas.</p>
            <p><strong>Días aprobados:</strong> ${dias}</p>
        `;

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
    const html = `
        <h2>SICU - Respuesta a tu solicitud de soporte</h2>
        <p>Hola <strong>${nombre}</strong>, hemos respondido a tu solicitud <em>'${asunto}'</em>.</p>
        <p><strong>Respuesta:</strong> ${respuesta}</p>
        <p>Si tienes más dudas no dudes en contactarnos.</p>
    `;

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
