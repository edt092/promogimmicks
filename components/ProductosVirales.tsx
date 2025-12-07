'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

const viralProducts = [
  '/img/imagenes-productos-virales/producto_1.jpg',
  '/img/imagenes-productos-virales/producto_2.png',
  '/img/imagenes-productos-virales/producto_3.jpg',
  '/img/imagenes-productos-virales/producto_4.jpg',
  '/img/imagenes-productos-virales/producto_5.jpg',
  '/img/imagenes-productos-virales/producto_6.jpg',
  '/img/imagenes-productos-virales/producto_7.jpg',
  '/img/imagenes-productos-virales/producto_8.jpg',
  '/img/imagenes-productos-virales/producto_9.jpg',
];

export default function ProductosVirales() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === viralProducts.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === viralProducts.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? viralProducts.length - 1 : prevIndex - 1
    );
  };

  return (
    <section id="productos-virales" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Texto */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6">
              Productos Virales de Temporada
            </h2>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Descubre las últimas tendencias en productos promocionales que
              están revolucionando el mercado. Desde gadgets tecnológicos hasta
              artículos eco-friendly, tenemos todo lo que necesitas para hacer
              que tu marca destaque.
            </p>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Nuestros productos virales son cuidadosamente seleccionados por su
              innovación, calidad y potencial de impacto. Mantén tu marca a la
              vanguardia con los artículos más solicitados del momento.
            </p>
            <a
              href="#contacto"
              className="inline-block px-8 py-4 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Ver Más...
            </a>
          </motion.div>

          {/* Slider de Imágenes */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative h-[400px] w-full rounded-2xl overflow-hidden shadow-2xl">
              {viralProducts.map((image, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-700 ${
                    index === currentIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`Producto viral ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              ))}
            </div>

            {/* Controles del Slider */}
            <button
              onClick={goToPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-all duration-300 shadow-lg"
              aria-label="Anterior"
            >
              <ChevronLeft className="text-blue-900" size={24} />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-all duration-300 shadow-lg"
              aria-label="Siguiente"
            >
              <ChevronRight className="text-blue-900" size={24} />
            </button>

            {/* Indicadores */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {viralProducts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-amber-500 w-8'
                      : 'bg-white/80'
                  }`}
                  aria-label={`Ir a imagen ${index + 1}`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
