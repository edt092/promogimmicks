'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const stockImages = [
  '/img/imagenes-de-stock/1.jpg',
  '/img/imagenes-de-stock/2.jpg',
  '/img/imagenes-de-stock/3.jpg',
  '/img/imagenes-de-stock/4.jpg',
  '/img/imagenes-de-stock/5.jpg',
  '/img/imagenes-de-stock/6.jpg',
  '/img/imagenes-de-stock/7.jpg',
  '/img/imagenes-de-stock/8.jpg',
  '/img/imagenes-de-stock/9.jpg',
  '/img/imagenes-de-stock/10.jpg',
  '/img/imagenes-de-stock/11.jpg',
  '/img/imagenes-de-stock/12.jpg',
];

export default function ProductosGallery() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
            Nuestros Productos
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Una muestra de nuestra variedad de productos promocionales y
            merchandising
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {stockImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="relative h-64 rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 group"
            >
              <Image
                src={image}
                alt={`Producto ${index + 1}`}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
