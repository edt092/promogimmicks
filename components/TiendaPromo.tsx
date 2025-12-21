'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ShoppingBag, MessageCircle, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

const featuredProducts = [
  {
    id: 1,
    nombre: "Bolsos y Mochilas",
    descripcion: "Mochilas, bolsos y maletines personalizados para tu marca",
    imagen: "/img/productos/morral-backpack-bobby-edge.jpg",
    categoria: "Bolsos y Mochilas"
  },
  {
    id: 2,
    nombre: "Drinkware Premium",
    descripcion: "Termos, mugs y botellas con tu logo corporativo",
    imagen: "/img/productos/mug-metalico-bamboo-eco-350ml.jpg",
    categoria: "Drinkware"
  },
  {
    id: 3,
    nombre: "Tecnología",
    descripcion: "Gadgets y accesorios tecnológicos personalizados",
    imagen: "/img/productos/audifonos-bluetooth-anc-nuevo.jpg",
    categoria: "Tecnología"
  },
  {
    id: 4,
    nombre: "Artículos de Escritura",
    descripcion: "Bolígrafos y sets ejecutivos con grabado láser",
    imagen: "/img/productos/boligrafo-boost-nuevo.jpg",
    categoria: "Artículos de Escritura"
  },
  {
    id: 5,
    nombre: "Eco & Sustentable",
    descripcion: "Productos ecológicos y amigables con el medio ambiente",
    imagen: "/img/productos/bolsa-en-algodon-botanik-135gr.jpg",
    categoria: "Eco"
  }
];

export default function TiendaPromo() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  const handleWhatsApp = () => {
    const mensaje = "Hola! Me interesa cotizar productos promocionales para mi empresa.";
    window.open(`https://wa.me/593998594123?text=${encodeURIComponent(mensaje)}`, '_blank');
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-400 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles size={16} />
            <span>Explora Nuestra Tienda</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            +1000 Productos Promocionales
          </h2>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            Encuentra el artículo perfecto para tu próxima campaña de marketing
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div
          className="relative"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Image Carousel */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative aspect-square rounded-3xl overflow-hidden bg-white/10 backdrop-blur-sm shadow-2xl"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  <img
                    src={featuredProducts[currentSlide].imagen}
                    alt={featuredProducts[currentSlide].nombre}
                    className="w-full h-full object-contain p-8"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Navigation arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
              >
                <ChevronLeft className="text-blue-900" size={24} />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
              >
                <ChevronRight className="text-blue-900" size={24} />
              </button>

              {/* Slide indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {featuredProducts.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentSlide
                        ? 'bg-amber-500 w-8'
                        : 'bg-white/50 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
            </motion.div>

            {/* Content Side */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-white"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="inline-block bg-amber-500 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
                    {featuredProducts[currentSlide].categoria}
                  </span>
                  <h3 className="text-3xl md:text-4xl font-bold mb-4">
                    {featuredProducts[currentSlide].nombre}
                  </h3>
                  <p className="text-xl text-blue-100 mb-8">
                    {featuredProducts[currentSlide].descripcion}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/tienda"
                  className="group inline-flex items-center justify-center gap-3 bg-white text-blue-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-amber-500 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <ShoppingBag size={22} />
                  Ver Tienda
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>

                <button
                  onClick={handleWhatsApp}
                  className="group inline-flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <MessageCircle size={22} />
                  Cotizar por WhatsApp
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-10 pt-8 border-t border-white/20">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-amber-400">+1000</div>
                  <div className="text-sm text-blue-200">Productos</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-amber-400">12</div>
                  <div className="text-sm text-blue-200">Categorías</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-amber-400">24h</div>
                  <div className="text-sm text-blue-200">Cotización</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Category Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-5 gap-4"
        >
          {featuredProducts.map((product, index) => (
            <button
              key={product.id}
              onClick={() => setCurrentSlide(index)}
              className={`p-4 rounded-xl text-center transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-white text-blue-900 shadow-lg scale-105'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <span className="font-semibold text-sm md:text-base">{product.categoria}</span>
            </button>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
