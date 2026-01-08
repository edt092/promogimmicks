'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const categorias = [
  {
    title: 'Regalos Empresariales',
    description: 'Obsequios corporativos de alta calidad para fidelizar clientes y reconocer empleados.',
    image: '/img/imagenes-de-stock/1.jpg',
    keywords: ['regalos corporativos', 'obsequios empresariales'],
  },
  {
    title: 'Textiles Personalizados',
    description: 'Camisetas, gorras, uniformes y prendas con tu logo bordado o estampado.',
    image: '/img/imagenes-de-stock/3.jpg',
    keywords: ['camisetas personalizadas', 'uniformes'],
  },
  {
    title: 'Artículos de Oficina',
    description: 'Tazas, termos, libretas, bolígrafos y accesorios de escritorio personalizados.',
    image: '/img/imagenes-de-stock/5.jpg',
    keywords: ['tazas personalizadas', 'artículos oficina'],
  },
  {
    title: 'Maletines y Bolsos',
    description: 'Mochilas, maletines ejecutivos, bolsas ecológicas y porta laptops con tu marca.',
    image: '/img/imagenes-de-stock/7.jpg',
    keywords: ['mochilas personalizadas', 'bolsos corporativos'],
  },
  {
    title: 'Tecnología Promocional',
    description: 'USB, power banks, audífonos, parlantes y gadgets tecnológicos personalizados.',
    image: '/img/imagenes-de-stock/9.jpg',
    keywords: ['USB personalizados', 'power banks'],
  },
  {
    title: 'Reconocimientos',
    description: 'Trofeos, medallas, placas conmemorativas y premios corporativos personalizados.',
    image: '/img/imagenes-de-stock/11.jpg',
    keywords: ['trofeos personalizados', 'reconocimientos'],
  },
];

export default function Catalogos() {
  return (
    <section id="categorias" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
            Productos Promocionales por Categoría
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Encuentra el artículo publicitario perfecto para tu campaña de marketing.
            Miles de opciones en productos promocionales para empresas en Ecuador y Colombia.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categorias.map((categoria, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              {/* Imagen de fondo */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={categoria.image}
                  alt={categoria.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {/* Overlay gradiente */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-900/20 to-transparent"></div>

                {/* Título sobre la imagen */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-xl font-bold text-white drop-shadow-lg">
                    {categoria.title}
                  </h3>
                </div>
              </div>

              {/* Contenido */}
              <div className="p-5">
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {categoria.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {categoria.keywords.map((keyword, i) => (
                    <span
                      key={i}
                      className="text-xs bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-medium"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              {/* Borde inferior animado */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link
            href="/tienda"
            className="inline-flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
          >
            Ver todos los productos
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
