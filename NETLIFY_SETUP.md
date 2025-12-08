# 📧 Configuración de Netlify Functions para ChatAdri

Este documento explica cómo configurar las variables de entorno en Netlify para que el sistema de notificaciones por email funcione correctamente.

## ✅ ¿Qué hemos implementado?

1. **Netlify Function** (`netlify/functions/notificar-lead.js`) - Función serverless que envía notificaciones
2. **Integración en ChatAdri** - El chat captura emails y los envía a la función
3. **Notificaciones automáticas** - Cada vez que un usuario deja su email, recibes una notificación en `info@promogimmicks.com`

## 🔧 Paso 3: Configurar Variables de Entorno en Netlify

Para que la función serverless pueda enviar correos, necesitas configurar 3 variables de entorno en el panel de Netlify:

### 1. Accede a tu sitio en Netlify

1. Ve a [https://app.netlify.com](https://app.netlify.com)
2. Selecciona tu sitio **promogimmicks.com**
3. Ve a **Site settings** (Configuración del sitio)
4. En el menú lateral, busca **Environment variables** (Variables de entorno)
5. Haz clic en **Add a variable** (Agregar variable)

### 2. Agregar las 3 variables necesarias

Necesitas configurar estas variables según tu proveedor de correo:

#### Opción A: Si usas Gmail (más común)

| Variable | Valor | Ejemplo |
|----------|-------|---------|
| `EMAIL_HOST` | `smtp.gmail.com` | smtp.gmail.com |
| `EMAIL_USER` | Tu correo de Gmail | info@promogimmicks.com |
| `EMAIL_PASS` | Contraseña de aplicación* | abcd efgh ijkl mnop |

**IMPORTANTE**: Para Gmail, NO uses tu contraseña normal. Debes crear una "Contraseña de aplicación":

1. Ve a [myaccount.google.com](https://myaccount.google.com)
2. Seguridad → Verificación en 2 pasos (debe estar activada)
3. Seguridad → Contraseñas de aplicaciones
4. Genera una contraseña para "Correo" → "Otro (Netlify)"
5. Copia la contraseña de 16 caracteres (sin espacios)

#### Opción B: Si usas otro proveedor de email

| Proveedor | EMAIL_HOST | Puerto |
|-----------|------------|--------|
| Outlook/Hotmail | smtp-mail.outlook.com | 587 |
| Yahoo | smtp.mail.yahoo.com | 465 |
| Hostinger | smtp.hostinger.com | 465 |
| cPanel/Hosting propio | mail.tudominio.com | 465 |

Para hosting propio (cPanel), consulta con tu proveedor el servidor SMTP correcto.

### 3. Ejemplo de configuración en Netlify

```
Variable 1:
- Key: EMAIL_HOST
- Value: smtp.gmail.com

Variable 2:
- Key: EMAIL_USER
- Value: info@promogimmicks.com

Variable 3:
- Key: EMAIL_PASS
- Value: abcd efgh ijkl mnop
```

### 4. Guardar y redesplegar

1. Después de agregar las 3 variables, haz clic en **Save** (Guardar)
2. Ve a **Deploys** en el menú superior
3. Haz clic en **Trigger deploy** → **Clear cache and deploy site**
4. Espera a que se complete el despliegue (1-3 minutos)

## 🧪 Probar que funciona

1. Ve a [https://promogimmicks.com](https://promogimmicks.com)
2. Espera 3 segundos a que aparezca el chat de Adri
3. Interactúa con el chat:
   - Responde "sí" cuando pregunta por el catálogo
   - Selecciona "correo electrónico"
   - Escribe un email de prueba (puede ser el tuyo)
4. Revisa tu bandeja de `info@promogimmicks.com`
5. Deberías recibir una notificación con el email del lead

## 📊 ¿Qué recibes en el correo?

Cada vez que un usuario deja su email, recibirás un correo con:

- ✉️ **Asunto**: "Nuevo Lead: Solicitud de Catálogo 🚀"
- 📧 **Email del usuario** capturado
- 📝 **Próximos pasos** sugeridos:
  - Enviar el catálogo completo
  - Realizar seguimiento en 24-48 horas
  - Ofrecer asesoría personalizada

## 🔍 Verificar logs (si algo falla)

Si no recibes correos:

1. Ve a Netlify → Tu sitio → **Functions**
2. Haz clic en `notificar-lead`
3. Revisa los **logs** para ver errores
4. Errores comunes:
   - `Invalid login` → Contraseña incorrecta (revisa EMAIL_PASS)
   - `Connection timeout` → EMAIL_HOST incorrecto
   - `Authentication failed` → Verifica que la verificación en 2 pasos esté activa (Gmail)

## 🎯 Resumen

✅ Función serverless creada
✅ Chat integrado con la función
✅ Correo de destino: `info@promogimmicks.com`
⏳ **PENDIENTE**: Configurar variables de entorno en Netlify

Una vez configuradas las variables de entorno, ¡todo estará listo! 🚀

## 💡 Próximos pasos opcionales

- Configurar autoresponder para enviar el catálogo automáticamente al usuario
- Integrar con un CRM (HubSpot, Salesforce, etc.)
- Crear un dashboard para visualizar los leads capturados
- Agregar Google Analytics para tracking de conversiones
