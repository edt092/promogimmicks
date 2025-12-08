'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MessageCircle } from 'lucide-react';

// Mensajes predefinidos del flujo de conversación de Adri
const MESSAGES = {
  greetingInitial: "Hola! Soy Adri, asesora comercial de PromoGimmicks. Contamos con un catálogo exclusivo de más de 500 productos promocionales que harán destacar tu marca. ¿Quieres que te envíe el catálogo completo?",

  // Respuestas afirmativas
  catalogRequest: "¡Excelente decisión! Tenemos dos formas de enviarte nuestro catálogo:\n\n📧 Por correo electrónico - Solo dime tu email y te lo envío al instante\n\n📱 Por WhatsApp - Escribe 'catalogo' al +593 99 859 4123 y te lo compartimos ahí mismo\n\n¿Cuál prefieres?",

  // Solicitar email
  askEmail: "Perfecto, por favor escríbeme tu correo electrónico y te enviaré nuestro catálogo completo de inmediato.",
  emailReceived: "¡Genial! He recibido tu correo: {email}\n\nTe enviaremos el catálogo en los próximos minutos. Revisa tu bandeja de entrada y también tu carpeta de spam, por si acaso.\n\nSi tienes alguna pregunta, no dudes en escribirnos. ¡Estamos aquí para ayudarte!",

  // Opción WhatsApp
  whatsappOption: "¡Perfecto! Para recibir el catálogo por WhatsApp:\n\n1️⃣ Guarda este número: +593 99 859 4123\n2️⃣ Envía un mensaje con la palabra 'catalogo'\n3️⃣ Te responderemos de inmediato con nuestro catálogo completo\n\n¿Hay algo más en lo que pueda ayudarte?",

  // Respuestas negativas o dudas
  notInterested: "Entiendo. Si cambias de opinión o tienes alguna pregunta sobre nuestros productos promocionales, estaré aquí para ayudarte. ¿Hay algo específico que te gustaría saber sobre nuestros productos?",

  // Ayuda adicional
  moreInfo: "Con gusto te ayudo. En PromoGimmicks ofrecemos:\n\n✅ Más de 500 productos promocionales\n✅ Personalización con tu logo o diseño\n✅ Precios competitivos al por mayor\n✅ Envíos a todo el país\n✅ Asesoría personalizada\n\nPuedes solicitar nuestro catálogo completo o preguntarme sobre algún producto específico. ¿Qué te gustaría saber?",

  // Despedida
  goodbye: "¡Gracias por contactarnos! Recuerda que puedes solicitar el catálogo en cualquier momento o escribirnos por WhatsApp al +593 99 859 4123. ¡Que tengas un excelente día!",

  // Mensaje de error de validación de email (amable)
  emailInvalidFormat: "Veo que el formato del correo no es del todo correcto. ¿Podrías verificarlo? Debe ser algo como: tuempresa@ejemplo.com 😊",
};

// Palabras clave para detección de intenciones
const KEYWORDS = {
  affirmative: ['sí', 'si', 'claro', 'dale', 'ok', 'bueno', 'listo', 'vamos', 'quiero', 'me interesa', 'por favor', 'envíame', 'enviame', 'perfecto', 'genial'],
  negative: ['no', 'nope', 'no gracias', 'ahora no', 'después', 'despues', 'luego'],
  email: ['email', 'correo', 'mail', 'e-mail', 'electronico', 'electrónico'],
  whatsapp: ['whatsapp', 'whats', 'wsp', 'wa', 'celular', 'teléfono', 'telefono', 'móvil', 'movil'],
  moreInfo: ['información', 'informacion', 'info', 'saber', 'conocer', 'productos', 'precio', 'costo', 'cuánto', 'cuanto'],
  goodbye: ['adiós', 'adios', 'chao', 'bye', 'hasta luego', 'gracias', 'nos vemos'],
};

// Función para validar email con regex mejorada
const isValidEmail = (email) => {
  // Regex más estricta que valida:
  // - Caracteres alfanuméricos, puntos, guiones y guiones bajos antes del @
  // - Dominio con al menos un punto
  // - TLD de al menos 2 caracteres
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
};

// Función para enviar notificación al equipo de PromoGimmicks
const sendLeadNotification = async (email) => {
  try {
    const response = await fetch('/.netlify/functions/notificar-lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email,
        asunto: 'Nuevo Lead: Solicitud de Catálogo desde Chat Web'
      }),
    });

    if (!response.ok) {
      console.error('Error al enviar notificación:', await response.text());
    } else {
      console.log('Notificación enviada exitosamente');
    }
  } catch (error) {
    console.error('Error al conectar con el servidor:', error);
  }
};

const ChatAdri = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationState, setConversationState] = useState('initial'); // initial, waiting_choice, waiting_email, completed
  const [showBadge, setShowBadge] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

  const messagesEndRef = useRef(null);
  const audioRef = useRef(null);

  // Scroll automático al último mensaje
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Abrir chat y limpiar badge
  const handleOpenChat = () => {
    setIsOpen(true);
    setShowBadge(false);
  };

  // Cerrar chat
  const handleCloseChat = () => {
    setIsOpen(false);
    // Mostrar badge si hay mensajes sin leer
    if (messages.length > 0 && messages[messages.length - 1].sender === 'adri') {
      setShowBadge(true);
    }
  };

  // Abrir chat automáticamente al cargar y enviar primer mensaje (después de 3 segundos)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
      setShowBadge(false);
      sendAdriMessage(MESSAGES.greetingInitial);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Reproducir sonido de notificación
  const playNotificationSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(err => console.log('Audio play failed:', err));
    }
  };

  // Enviar mensaje de Adri con delay y animación
  const sendAdriMessage = (text, delay = null) => {
    // Calcular delay basado en longitud del mensaje
    const baseDelay = 2000;
    const textLength = text.length;
    const readingTime = Math.min(textLength * 25, 3500);
    const thinkingTime = Math.random() * 1500 + 1000;

    const calculatedDelay = delay !== null ? delay : (baseDelay + readingTime + thinkingTime);

    setIsTyping(true);

    setTimeout(() => {
      setMessages(prev => [...prev, {
        text,
        sender: 'adri',
        timestamp: new Date()
      }]);
      setIsTyping(false);

      // Mostrar badge si el chat está cerrado
      if (!isOpen) {
        setShowBadge(true);
      }

      playNotificationSound();
    }, calculatedDelay);
  };

  // Detectar intención del usuario basado en palabras clave
  const detectIntent = (text) => {
    const lowerText = text.toLowerCase();

    for (const [intent, keywords] of Object.entries(KEYWORDS)) {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        return intent;
      }
    }

    return null;
  };

  // Procesar respuesta del usuario
  const processUserResponse = async (text) => {
    const intent = detectIntent(text);
    const lowerText = text.toLowerCase();

    // Estado inicial - esperando respuesta sobre el catálogo
    if (conversationState === 'initial') {
      if (intent === 'affirmative') {
        setConversationState('waiting_choice');
        sendAdriMessage(MESSAGES.catalogRequest);
      } else if (intent === 'negative') {
        setConversationState('completed');
        sendAdriMessage(MESSAGES.notInterested);
      } else if (intent === 'moreInfo') {
        sendAdriMessage(MESSAGES.moreInfo);
      } else if (intent === 'goodbye') {
        setConversationState('completed');
        sendAdriMessage(MESSAGES.goodbye);
      } else {
        // Si no entendemos, repetir la pregunta
        sendAdriMessage("Perdón, no entendí bien. ¿Te gustaría recibir nuestro catálogo con más de 500 productos promocionales?");
      }
      return;
    }

    // Esperando elección: email o whatsapp
    if (conversationState === 'waiting_choice') {
      if (intent === 'email' || isValidEmail(text)) {
        if (isValidEmail(text)) {
          // Si directamente envió el email válido - aceptarlo
          setConversationState('completed');
          const emailMessage = MESSAGES.emailReceived.replace('{email}', text);
          sendAdriMessage(emailMessage);
          // Enviar notificación al equipo de PromoGimmicks
          sendLeadNotification(text);
        } else {
          // Si eligió email pero no lo envió
          setConversationState('waiting_email');
          sendAdriMessage(MESSAGES.askEmail);
        }
      } else if (intent === 'whatsapp') {
        setConversationState('completed');
        sendAdriMessage(MESSAGES.whatsappOption);
      } else if (intent === 'goodbye') {
        setConversationState('completed');
        sendAdriMessage(MESSAGES.goodbye);
      } else {
        // Si no entendemos, repetir opciones
        sendAdriMessage("¿Prefieres que te envíe el catálogo por correo electrónico o por WhatsApp?");
      }
      return;
    }

    // Esperando email
    if (conversationState === 'waiting_email') {
      if (isValidEmail(text)) {
        // Email tiene formato válido - aceptarlo
        setConversationState('completed');
        const emailMessage = MESSAGES.emailReceived.replace('{email}', text);
        sendAdriMessage(emailMessage);
        // Enviar notificación al equipo de PromoGimmicks
        sendLeadNotification(text);
      } else {
        // Email con formato inválido
        sendAdriMessage(MESSAGES.emailInvalidFormat);
      }
      return;
    }

    // Conversación completada
    if (conversationState === 'completed') {
      if (intent === 'affirmative' || intent === 'moreInfo') {
        setConversationState('initial');
        sendAdriMessage(MESSAGES.greetingInitial);
      } else if (intent === 'goodbye') {
        sendAdriMessage(MESSAGES.goodbye);
      } else {
        sendAdriMessage("Si necesitas algo más o quieres solicitar el catálogo nuevamente, solo dímelo. También puedes escribirnos por WhatsApp al +593 99 859 4123");
      }
      return;
    }
  };

  // Enviar mensaje del usuario
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    processUserResponse(inputValue);
    setInputValue('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Audio para notificaciones */}
      <audio ref={audioRef} src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZURE" preload="auto" />

      {/* Botón flotante con efecto de pulso - Responsive */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            className="fixed bottom-4 right-3 md:bottom-8 md:right-8 z-40"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              delay: 0.5,
              type: 'spring',
              stiffness: 260,
              damping: 20
            }}
          >
            {/* Efecto de pulso animado */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-ping opacity-75" />

            <motion.button
              whileHover={{ scale: 1.1, shadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOpenChat}
              className="relative bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-3 md:p-5 rounded-full shadow-2xl hover:shadow-blue-500/50 transition-all duration-300"
              aria-label="Abrir chat"
            >
              <MessageCircle className="w-6 h-6 md:w-8 md:h-8" />

              {/* Badge de notificación */}
              <AnimatePresence>
                {showBadge && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center font-bold border-2 border-white"
                  >
                    !
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ventana de chat - Responsive */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 20
            }}
            className="fixed bottom-4 right-3 w-[90vw] sm:w-[85vw] md:bottom-8 md:right-8 md:w-full md:max-w-md z-40 bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden border border-gray-200"
            style={{ height: '500px', maxHeight: 'calc(100vh - 100px)' }}
          >
            {/* Header - Responsive */}
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 md:p-4 flex items-center justify-between">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="relative">
                  <img
                    src="/img/adri_asistente/adri.jpg"
                    alt="Adri"
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                  {/* Avatar fallback con inicial */}
                  <div className="hidden w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white bg-gradient-to-br from-blue-400 to-cyan-400 items-center justify-center">
                    <span className="text-white font-bold text-lg md:text-xl">A</span>
                  </div>
                  {/* Indicador "en línea" */}
                  <motion.div
                    className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                </div>
                <div className="text-white">
                  <h3 className="font-bold text-base md:text-lg">Adri</h3>
                  <div className="flex items-center gap-1.5 text-xs md:text-sm opacity-90">
                    <motion.div
                      className="w-2 h-2 bg-green-400 rounded-full"
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    />
                    <span>Asesora Comercial</span>
                  </div>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleCloseChat}
                className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                aria-label="Cerrar chat"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.div>
                </AnimatePresence>
              </motion.button>
            </div>

            {/* Mensajes - Responsive */}
            <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4 bg-gray-50">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.1
                  }}
                  className={`flex gap-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.sender === 'adri' && (
                    <img
                      src="/img/adri_asistente/adri.jpg"
                      alt="Adri"
                      className="w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-gray-200 object-cover flex-shrink-0 self-end"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                  )}
                  {/* Avatar fallback para mensajes */}
                  {message.sender === 'adri' && (
                    <div className="hidden w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-gray-200 bg-gradient-to-br from-blue-400 to-cyan-400 items-center justify-center flex-shrink-0 self-end">
                      <span className="text-white font-bold text-xs">A</span>
                    </div>
                  )}
                  <div className="flex flex-col max-w-[85%] md:max-w-[75%]">
                    <div
                      className={`px-3 py-2 md:px-4 md:py-3 rounded-2xl whitespace-pre-line ${
                        message.sender === 'user'
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-tr-none shadow-sm'
                          : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none shadow-sm'
                      }`}
                    >
                      <p className="text-xs md:text-sm leading-relaxed break-words">{message.text}</p>
                    </div>
                    {/* Timestamp */}
                    <span className={`text-[10px] md:text-xs text-gray-500 mt-1 px-1 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                      {message.timestamp.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </motion.div>
              ))}

              {/* Indicador de escritura - Responsive */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2 justify-start"
                >
                  <img
                    src="/img/adri_asistente/adri.jpg"
                    alt="Adri"
                    className="w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-gray-200 object-cover flex-shrink-0 self-end"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                  <div className="hidden w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-gray-200 bg-gradient-to-br from-blue-400 to-cyan-400 items-center justify-center flex-shrink-0 self-end">
                    <span className="text-white font-bold text-xs">A</span>
                  </div>
                  <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm">
                    <div className="flex gap-1">
                      <motion.div
                        className="w-2 h-2 bg-gray-400 rounded-full"
                        animate={{ y: [0, -6, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-gray-400 rounded-full"
                        animate={{ y: [0, -6, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-gray-400 rounded-full"
                        animate={{ y: [0, -6, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input - Responsive */}
            <div className="p-2 md:p-4 border-t border-gray-200 bg-white">
              <div className="flex gap-1.5 md:gap-2 items-center">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Escribe tu mensaje..."
                  className="flex-1 px-3 py-2 md:px-4 md:py-3 text-xs md:text-sm bg-gray-100 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-900"
                />
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-2 md:p-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all flex-shrink-0"
                  aria-label="Enviar mensaje"
                >
                  <Send className="w-4 h-4 md:w-5 md:h-5" />
                </motion.button>
              </div>

              {/* Mensaje informativo solo en desktop */}
              <p className="hidden md:block text-xs text-gray-500 text-center mt-3">
                Presiona Enter para enviar
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatAdri;
