'use client';

import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import Image from 'next/image';

const catalogos = [
  {
    title: 'Premiums',
    image: '/img/imagenes-catalogos/premium.jpg',
    link: 'https://www.catalogospromocionales.com/seccion/inicio.html',
  },
  {
    title: 'MP',
    image: '/img/imagenes-catalogos/mp.jpg',
    link: 'https://www.marpicopromocionales.com/#/',
  },
  {
    title: 'CDO',
    image: '/img/imagenes-catalogos/cdo.jpg',
    link: 'https://colombia.cdopromocionales.com/#',
  },
  {
    title: 'BS',
    image: '/img/imagenes-catalogos/bs.jpg',
    link: 'https://buybeststock.com/',
  },
];

export default function Catalogos() {
  return (
    <section id="catalogos" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
            Nuestros Catálogos
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Explora nuestra amplia selección de catálogos especializados con
            miles de productos promocionales para tu empresa
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {catalogos.map((catalogo, index) => (
            <motion.a
              key={index}
              href={catalogo.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={catalogo.image}
                  alt={catalogo.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                {/* Overlay en hover */}
                <div className="absolute inset-0 bg-blue-900/0 group-hover:bg-blue-900/20 transition-all duration-300"></div>
              </div>

              <div className="p-6 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-blue-900 group-hover:text-amber-500 transition-colors duration-300">
                  {catalogo.title}
                </h3>
                <ExternalLink
                  className="text-gray-400 group-hover:text-amber-500 transition-colors duration-300"
                  size={20}
                />
              </div>

              {/* Borde animado en hover */}
              <div className="absolute inset-0 border-4 border-transparent group-hover:border-blue-500 rounded-2xl transition-all duration-300 pointer-events-none"></div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
