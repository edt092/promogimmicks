// netlify/functions/verificar-email.js

// Validación ligera de email - Solo bloquea dominios temporales conocidos
// NO verifica DNS/MX para evitar falsos positivos con dominios válidos

exports.handler = async function(event, context) {
  console.log('🔍 Función verificar-email iniciada');
  console.log('📨 Método HTTP:', event.httpMethod);

  // Solo permitir peticiones POST
  if (event.httpMethod !== 'POST') {
    console.log('❌ Método no permitido:', event.httpMethod);
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Método no permitido' }),
    };
  }

  try {
    // Extraer el email del cuerpo de la petición
    console.log('📦 Body recibido:', event.body);
    const { email } = JSON.parse(event.body);
    console.log('📧 Email a verificar:', email);

    if (!email) {
      console.log('❌ Email no proporcionado');
      return {
        statusCode: 400,
        body: JSON.stringify({
          valid: false,
          message: 'El correo es obligatorio'
        }),
      };
    }

    // 1. Validar formato del email (regex simple y permisiva)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      console.log('❌ Formato de email inválido');
      return {
        statusCode: 200,
        body: JSON.stringify({
          valid: false,
          reason: 'format',
          message: 'El formato del correo no es válido'
        }),
      };
    }

    console.log('✅ Formato de email válido');

    // 2. Extraer el dominio del email
    const domain = email.split('@')[1].toLowerCase();
    console.log('🌐 Dominio extraído:', domain);

    // 3. Verificar que el dominio no sea temporal/desechable
    const disposableDomains = [
      // Dominios temporales muy comunes
      'tempmail.com', 'temp-mail.org', 'temp-mail.io',
      'guerrillamail.com', 'guerrillamail.net', 'guerrillamail.org',
      '10minutemail.com', '10minutemail.net',
      'mailinator.com', 'mailinator2.com',
      'throwaway.email', 'throwawaymail.com',
      'getnada.com', 'getairmail.com',
      'fakeinbox.com', 'fakemailgenerator.com',
      'yopmail.com', 'yopmail.fr', 'yopmail.net',
      'trashmail.com', 'trashmail.net',
      'maildrop.cc', 'mailnesia.com', 'mintemail.com',
      'sharklasers.com', 'spam4.me',
      'tempail.com', 'tempinbox.com',
      'mohmal.com', 'emailondeck.com',
      'throwam.com', 'armyspy.com',
      'cuvox.de', 'dayrep.com', 'einrot.com',
      'fleckens.hu', 'gustr.com', 'jourrapide.com',
      'rhyta.com', 'superrito.com', 'teleworm.us'
    ];

    if (disposableDomains.includes(domain)) {
      console.log('⚠️ Dominio de correo temporal detectado:', domain);
      return {
        statusCode: 200,
        body: JSON.stringify({
          valid: false,
          reason: 'disposable',
          message: 'Por favor usa un correo electrónico permanente, no temporal'
        }),
      };
    }

    // 4. Validación adicional: verificar que el dominio tenga al menos un punto
    if (!domain.includes('.')) {
      console.log('❌ Dominio sin TLD válido');
      return {
        statusCode: 200,
        body: JSON.stringify({
          valid: false,
          reason: 'format',
          message: 'El dominio del correo no es válido'
        }),
      };
    }

    // 5. Todo bien - email válido
    console.log('✅ Email verificado exitosamente');
    console.log('📧 Email aceptado:', email);
    console.log('🌐 Dominio:', domain);

    return {
      statusCode: 200,
      body: JSON.stringify({
        valid: true,
        email: email,
        domain: domain,
        message: 'Email válido'
      }),
    };

  } catch (error) {
    console.error('❌ ERROR al verificar email:');
    console.error('   Mensaje:', error.message);
    console.error('   Stack:', error.stack);

    // En caso de error, aceptar el email (fail-safe)
    return {
      statusCode: 200,
      body: JSON.stringify({
        valid: true,
        email: event.body ? JSON.parse(event.body).email : '',
        message: 'Email aceptado (verificación omitida por error)',
        warning: 'Validation error, email accepted by default'
      }),
    };
  }
};
