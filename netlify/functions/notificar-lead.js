// netlify/functions/notificar-lead.js

const nodemailer = require('nodemailer');

// La función principal que Netlify ejecutará
exports.handler = async function(event, context) {
  // 1. Solo permitir peticiones POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Método no permitido' }),
    };
  }

  try {
    // 2. Extraer el correo del cuerpo de la petición
    const { email: userEmail, asunto } = JSON.parse(event.body);

    if (!userEmail) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'El correo es obligatorio' }),
      };
    }

    // 3. Configurar el transportador de correo (¡Usa Variables de Entorno!)
    // Estas variables las configurarás en el panel de Netlify, no aquí.
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 465,
      secure: true, // true para puerto 465
      auth: {
        user: process.env.EMAIL_USER, // Tu correo de envío
        pass: process.env.EMAIL_PASS, // Tu contraseña de aplicación
      },
    });

    // 4. Enviar el correo de notificación
    await transporter.sendMail({
      from: `"Chat Web PromoGimmicks 🤖" <${process.env.EMAIL_USER}>`,
      to: 'info@promogimmicks.com', // Correo que recibe las notificaciones
      subject: asunto || 'Nuevo Lead: Solicitud de Catálogo 🚀',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
          <div style="background-color: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h1 style="color: #0891b2; margin-bottom: 20px;">¡Nuevo Lead! 🎉</h1>
            <p style="font-size: 16px; color: #333; margin-bottom: 15px;">
              Un usuario ha solicitado el catálogo de productos promocionales a través del chat de la web.
            </p>
            <div style="background-color: #f0f9ff; border-left: 4px solid #0891b2; padding: 15px; margin: 20px 0;">
              <p style="margin: 0; font-size: 14px; color: #666;"><strong>Correo del usuario:</strong></p>
              <p style="margin: 5px 0 0 0; font-size: 18px; color: #0891b2; font-weight: bold;">${userEmail}</p>
            </div>
            <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 25px 0;">
            <p style="font-size: 14px; color: #666; margin-bottom: 10px;">
              <strong>📌 Próximos pasos:</strong>
            </p>
            <ul style="font-size: 14px; color: #666; line-height: 1.8;">
              <li>Enviar el catálogo completo de productos a <strong>${userEmail}</strong></li>
              <li>Realizar seguimiento del lead en las próximas 24-48 horas</li>
              <li>Ofrecer asesoría personalizada según sus necesidades</li>
            </ul>
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e5e5;">
              <p style="font-size: 12px; color: #999; margin: 0;">
                Este correo fue generado automáticamente desde el chat de <strong>promogimmicks.com</strong>
              </p>
            </div>
          </div>
        </div>
      `,
    });

    // 5. Responder al frontend que todo fue un éxito
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Notificación enviada con éxito' }),
    };

  } catch (error) {
    console.error('Error al enviar el correo:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error interno al enviar la notificación.',
        error: error.message
      }),
    };
  }
};
