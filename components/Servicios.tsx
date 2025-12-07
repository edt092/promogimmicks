'use client';

import { motion } from 'framer-motion';
import { Printer, Megaphone, Plane } from 'lucide-react';

const servicios = [
  {
    icon: Printer,
    title: 'Impresión',
    description:
      'Servicios de impresión de alta calidad para tus productos promocionales. Desde serigrafía hasta impresión digital y tampografía.',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    icon: Megaphone,
    title: 'Promocionales',
    description:
      'Amplia gama de artículos promocionales personalizados para potenciar tu marca y conectar con tu audiencia de manera efectiva.',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
  },
  {
    icon: Plane,
    title: 'Importación',
    description:
      'Importamos productos exclusivos desde Asia, Europa y América. Acceso a las últimas tendencias del mercado internacional.',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
];

export default function Servicios() {
  return (
    <section id="servicios" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
            Nuestros Servicios
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Soluciones integrales para todas tus necesidades de marketing y
            merchandising
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {servicios.map((servicio, index) => {
            const Icon = servicio.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 group hover:-translate-y-2"
              >
                <div
                  className={`${servicio.bgColor} w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className={`${servicio.color}`} size={32} />
                </div>

                <h3 className="text-2xl font-bold text-blue-900 mb-4 group-hover:text-amber-500 transition-colors duration-300">
                  {servicio.title}
                </h3>

                <p className="text-gray-700 leading-relaxed">
                  {servicio.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
