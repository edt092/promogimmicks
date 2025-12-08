// netlify/functions/notificar-lead.js

// Usaremos Nodemailer, una librería muy popular para enviar correos en Node.js
const nodemailer = require('nodemailer');

// La función principal que Netlify ejecutará
exports.handler = async function(event, context) {
  // Log de inicio
  console.log('🚀 Función notificar-lead iniciada');
  console.log('📨 Método HTTP:', event.httpMethod);

  // 1. Solo permitir peticiones POST
  if (event.httpMethod !== 'POST') {
    console.log('❌ Método no permitido:', event.httpMethod);
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Método no permitido' }),
    };
  }

  try {
    // 2. Extraer el correo del cuerpo de la petición
    console.log('📦 Body recibido:', event.body);
    const { email: userEmail, asunto } = JSON.parse(event.body);
    console.log('📧 Email del usuario:', userEmail);
    console.log('📝 Asunto:', asunto);

    // Validar que el email fue proporcionado
    if (!userEmail) {
      console.log('❌ Email no proporcionado');
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'El correo es obligatorio' }),
      };
    }

    // 3. Verificar variables de entorno
    console.log('🔧 Verificando variables de entorno...');
    console.log('   EMAIL_HOST:', process.env.EMAIL_HOST ? '✅ Configurado' : '❌ NO configurado');
    console.log('   EMAIL_USER:', process.env.EMAIL_USER ? '✅ Configurado' : '❌ NO configurado');
    console.log('   EMAIL_PASS:', process.env.EMAIL_PASS ? '✅ Configurado' : '❌ NO configurado');

    if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('❌ Variables de entorno faltantes');
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: 'Error de configuración: Variables de entorno faltantes',
          details: 'Por favor configura EMAIL_HOST, EMAIL_USER y EMAIL_PASS en Netlify'
        }),
      };
    }

    // 4. Configurar el transportador de correo
    console.log('⚙️ Configurando transportador de correo...');
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 465,
      secure: true, // true para puerto 465
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    console.log('✅ Transportador configurado correctamente');

    // 5. Preparar contenido del correo
    const mailOptions = {
      from: `"Chat Web PromoGimmicks 🤖" <${process.env.EMAIL_USER}>`,
      to: 'info@promogimmicks.com',
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
    };

    console.log('📨 Preparando envío de correo...');
    console.log('   De:', mailOptions.from);
    console.log('   Para:', mailOptions.to);
    console.log('   Asunto:', mailOptions.subject);

    // 6. Enviar el correo de notificación
    console.log('📤 Enviando correo...');
    const info = await transporter.sendMail(mailOptions);

    console.log('✅ ¡Correo enviado exitosamente!');
    console.log('📬 Message ID:', info.messageId);
    console.log('📊 Response:', info.response);

    // 7. Responder al frontend que todo fue un éxito
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Notificación enviada con éxito',
        messageId: info.messageId,
        userEmail: userEmail
      }),
    };

  } catch (error) {
    // Log detallado del error
    console.error('❌ ERROR CRÍTICO al enviar el correo:');
    console.error('   Mensaje:', error.message);
    console.error('   Stack:', error.stack);
    console.error('   Code:', error.code);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error interno al enviar la notificación.',
        error: error.message,
        code: error.code || 'UNKNOWN_ERROR'
      }),
    };
  }
};
