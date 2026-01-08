'use client';

import { motion } from 'framer-motion';
import { MapPin, CheckCircle, Truck } from 'lucide-react';

// SVG creativo e interactivo para el Dólar (USD)
const MonedaUSD = () => (
  <motion.svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    className="cursor-pointer"
    whileHover={{ scale: 1.2, rotate: 360 }}
    whileTap={{ scale: 0.9 }}
    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
  >
    <defs>
      <linearGradient id="goldGradientUSD" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFD700" />
        <stop offset="50%" stopColor="#FFA500" />
        <stop offset="100%" stopColor="#FFD700" />
      </linearGradient>
      <filter id="glowUSD" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <motion.circle
      cx="24"
      cy="24"
      r="22"
      fill="url(#goldGradientUSD)"
      stroke="#B8860B"
      strokeWidth="2"
      filter="url(#glowUSD)"
      animate={{
        boxShadow: ['0 0 10px #FFD700', '0 0 20px #FFD700', '0 0 10px #FFD700']
      }}
    />
    <circle cx="24" cy="24" r="18" fill="none" stroke="#B8860B" strokeWidth="1" opacity="0.5" />
    <text
      x="24"
      y="30"
      textAnchor="middle"
      fontSize="18"
      fontWeight="bold"
      fill="#8B4513"
      fontFamily="serif"
    >
      $
    </text>
    <motion.g
      animate={{ opacity: [0.3, 0.8, 0.3] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <circle cx="12" cy="12" r="2" fill="#FFFFFF" opacity="0.8" />
      <circle cx="36" cy="16" r="1.5" fill="#FFFFFF" opacity="0.6" />
    </motion.g>
  </motion.svg>
);

// SVG creativo e interactivo para el Peso Colombiano (COP)
const MonedaCOP = () => (
  <motion.svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    className="cursor-pointer"
    whileHover={{ scale: 1.2, rotate: -360 }}
    whileTap={{ scale: 0.9 }}
    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
  >
    <defs>
      <linearGradient id="silverGradientCOP" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#C0C0C0" />
        <stop offset="50%" stopColor="#E8E8E8" />
        <stop offset="100%" stopColor="#C0C0C0" />
      </linearGradient>
      <linearGradient id="copperRingCOP" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#B87333" />
        <stop offset="50%" stopColor="#DA8A67" />
        <stop offset="100%" stopColor="#B87333" />
      </linearGradient>
      <filter id="glowCOP" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <motion.circle
      cx="24"
      cy="24"
      r="22"
      fill="url(#copperRingCOP)"
      stroke="#8B4513"
      strokeWidth="2"
      filter="url(#glowCOP)"
    />
    <circle
      cx="24"
      cy="24"
      r="16"
      fill="url(#silverGradientCOP)"
      stroke="#A0A0A0"
      strokeWidth="1"
    />
    <text
      x="24"
      y="28"
      textAnchor="middle"
      fontSize="10"
      fontWeight="bold"
      fill="#4A4A4A"
      fontFamily="sans-serif"
    >
      COP
    </text>
    <motion.g
      animate={{ rotate: 360 }}
      transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      style={{ transformOrigin: '24px 24px' }}
    >
      <circle cx="24" cy="6" r="1.5" fill="#FFD700" />
      <circle cx="24" cy="42" r="1.5" fill="#FFD700" />
      <circle cx="6" cy="24" r="1.5" fill="#FFD700" />
      <circle cx="42" cy="24" r="1.5" fill="#FFD700" />
    </motion.g>
    <motion.g
      animate={{ opacity: [0.3, 0.8, 0.3] }}
      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
    >
      <circle cx="14" cy="14" r="2" fill="#FFFFFF" opacity="0.7" />
      <circle cx="34" cy="18" r="1.5" fill="#FFFFFF" opacity="0.5" />
    </motion.g>
  </motion.svg>
);

const paises = [
  {
    nombre: 'Ecuador',
    bandera: '🇪🇨',
    moneda: 'USD',
    MonedaIcon: MonedaUSD,
    beneficios: [
      'Cobertura nacional',
      'Soporte local',
      'Envíos a todo el país',
      'Atención personalizada',
    ],
  },
  {
    nombre: 'Colombia',
    bandera: '🇨🇴',
    moneda: 'COP',
    MonedaIcon: MonedaCOP,
    beneficios: [
      'Cobertura nacional',
      'Soporte local',
      'Envíos a todo el país',
      'Atención personalizada',
    ],
  },
];

export default function Cobertura() {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 relative overflow-hidden">
      {/* Decoración de fondo */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-amber-500 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-400 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Truck size={18} />
            <span>Cobertura Internacional</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Servimos a empresas en{' '}
            <span className="text-amber-500">Ecuador y Colombia</span>
          </h2>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            Somos tu aliado estratégico en productos promocionales y artículos publicitarios
            personalizados con presencia en ambos países.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {paises.map((pais, index) => (
            <motion.div
              key={pais.nombre}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-6">
                <span className="text-5xl">{pais.bandera}</span>
                <div>
                  <h3 className="text-2xl font-bold text-white">{pais.nombre}</h3>
                  <div className="flex items-center gap-1 text-amber-400 text-sm">
                    <MapPin size={14} />
                    <span>Cobertura nacional</span>
                  </div>
                </div>
              </div>

              <ul className="space-y-3">
                {pais.beneficios.map((beneficio, i) => (
                  <li key={i} className="flex items-center gap-3 text-blue-100">
                    <CheckCircle className="text-amber-500 flex-shrink-0" size={20} />
                    <span>{beneficio}</span>
                  </li>
                ))}
              </ul>

              {/* Moneda interactiva */}
              <div className="mt-6 flex items-center justify-center">
                <pais.MonedaIcon />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-10"
        >
          <a
            href="#contacto"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
          >
            Solicitar cotización
          </a>
        </motion.div>
      </div>
    </section>
  );
}
