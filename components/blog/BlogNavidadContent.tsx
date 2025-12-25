'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Gift,
  Star,
  TreePine,
  Snowflake,
  ShoppingBag,
  MessageCircle,
  ArrowRight,
  Sparkles,
  Heart,
  Users,
  Target,
  Lightbulb,
  CheckCircle2,
  TrendingUp,
  Leaf,
  Calculator,
  Truck,
  Award,
  Clock,
  HelpCircle
} from 'lucide-react';
import productsData from '@/data/products.json';

// Categorías de productos relevantes para Navidad
const getChristmasProducts = () => {
  const categories = ['Drinkware', 'Tecnología', 'Hogar', 'Oficina', 'Eco', 'Textil y Vestuario'];
  return productsData.filter(p => categories.includes(p.categoria)).slice(0, 12);
};

const getProductsByCategory = (category: string, limit: number = 4) => {
  return productsData
    .filter(p => p.categoria.toLowerCase().includes(category.toLowerCase()))
    .slice(0, limit);
};

// Carrusel interactivo de productos navideños
function ChristmasCarousel() {
  const products = getChristmasProducts();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const itemsPerView = 4;
  const maxIndex = Math.max(0, products.length - itemsPerView);

  const nextSlide = useCallback(() => {
    setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prevSlide = () => {
    setCurrentIndex(prev => (prev <= 0 ? maxIndex : prev - 1));
  };

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  const handleCotizar = (e: React.MouseEvent, productName: string) => {
    e.preventDefault();
    e.stopPropagation();
    const mensaje = `Hola! Me interesa cotizar para regalo navideño: ${productName}`;
    const whatsappUrl = `https://wa.me/593998594123?text=${encodeURIComponent(mensaje)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div
      className="my-12 bg-gradient-to-br from-red-900 via-red-800 to-green-900 rounded-3xl overflow-hidden shadow-2xl relative"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Decoración navideña */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-4 left-4 text-white/20">
          <Snowflake size={40} />
        </div>
        <div className="absolute top-8 right-8 text-white/20">
          <TreePine size={50} />
        </div>
        <div className="absolute bottom-4 left-1/4 text-white/20">
          <Gift size={35} />
        </div>
        <div className="absolute bottom-8 right-1/3 text-white/20">
          <Star size={30} className="fill-current" />
        </div>
      </div>

      <div className="relative p-8 md:p-10">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-4 border border-white/30">
            <Gift size={16} className="text-amber-400" />
            Regalos Corporativos Navideños
          </span>
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Ideas para tu Campaña Navideña
          </h3>
          <p className="text-red-100">Productos perfectos para regalos de fin de año</p>
        </div>

        {/* Carrusel */}
        <div className="relative">
          {/* Botón anterior */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white/90 hover:bg-white text-red-900 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
            aria-label="Anterior"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Productos */}
          <div className="overflow-hidden mx-8">
            <div
              className="flex transition-transform duration-500 ease-out gap-4"
              style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView + 1)}%)` }}
            >
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/tienda/${product.slug}`}
                  className="group flex-shrink-0 w-full sm:w-1/2 md:w-1/4 bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40 hover:scale-105"
                >
                  <div className="relative h-32 md:h-40 bg-white/10 overflow-hidden">
                    <img
                      src={product.imagen_url}
                      alt={product.nombre}
                      className="w-full h-full object-contain p-3 group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => { (e.target as HTMLImageElement).src = '/img/placeholder-producto.svg'; }}
                    />
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      Navidad
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="text-white font-semibold text-sm line-clamp-2 mb-2 group-hover:text-amber-300 transition-colors">
                      {product.nombre}
                    </h4>
                    <span className="text-red-200 text-xs">{product.categoria}</span>
                    <button
                      onClick={(e) => handleCotizar(e, product.nombre)}
                      className="w-full mt-3 bg-amber-500 hover:bg-amber-600 text-white text-xs py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <Gift size={14} />
                      Cotizar Regalo
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Botón siguiente */}
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white/90 hover:bg-white text-red-900 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
            aria-label="Siguiente"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Indicadores */}
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-amber-400 w-8'
                  : 'bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Ir a slide ${index + 1}`}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-8">
          <Link
            href="/tienda"
            className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-red-900 px-8 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <ShoppingBag size={18} />
            Ver catálogo completo de regalos
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}

// CTA temático navideño
function ChristmasCTA({
  variant = 'primary',
  title,
  subtitle
}: {
  variant?: 'primary' | 'gift' | 'whatsapp' | 'eco';
  title?: string;
  subtitle?: string;
}) {
  const handleWhatsApp = () => {
    const mensaje = "Hola! Me interesa cotizar artículos promocionales navideños para mi empresa.";
    const whatsappUrl = `https://wa.me/593998594123?text=${encodeURIComponent(mensaje)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (variant === 'gift') {
    return (
      <div className="my-10 bg-gradient-to-r from-red-600 to-red-700 rounded-2xl overflow-hidden shadow-xl relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-2 right-4"><Snowflake size={60} /></div>
          <div className="absolute bottom-2 left-4"><Gift size={50} /></div>
        </div>
        <div className="relative p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Gift size={32} className="text-white" />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-white">
                {title || "Regalos Corporativos Navideños"}
              </h3>
              <p className="text-red-100">
                {subtitle || "Sorprende a tus clientes y empleados esta Navidad"}
              </p>
            </div>
          </div>
          <Link
            href="/tienda"
            className="bg-white hover:bg-gray-100 text-red-600 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2"
          >
            <TreePine size={20} />
            Ver Regalos
          </Link>
        </div>
      </div>
    );
  }

  if (variant === 'whatsapp') {
    return (
      <div className="my-10 bg-gradient-to-r from-green-600 to-green-700 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
              <MessageCircle size={28} className="text-white" />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-white">
                {title || "Asesoría para tu Campaña Navideña"}
              </h3>
              <p className="text-green-100">
                {subtitle || "Te ayudamos a elegir los mejores regalos para tu empresa"}
              </p>
            </div>
          </div>
          <button
            onClick={handleWhatsApp}
            className="bg-white hover:bg-gray-100 text-green-600 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2"
          >
            <MessageCircle size={20} />
            Chatear ahora
          </button>
        </div>
      </div>
    );
  }

  if (variant === 'eco') {
    return (
      <div className="my-10 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
              <Leaf size={28} className="text-white" />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-white">
                {title || "Regalos Navideños Eco-Friendly"}
              </h3>
              <p className="text-emerald-100">
                {subtitle || "Opciones sostenibles que cuidan el planeta"}
              </p>
            </div>
          </div>
          <Link
            href="/tienda"
            className="bg-white hover:bg-gray-100 text-emerald-600 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2"
          >
            <Leaf size={20} />
            Ver productos eco
          </Link>
        </div>
      </div>
    );
  }

  // Primary
  return (
    <div className="my-12 relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-900 via-red-800 to-green-900 shadow-2xl">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-400 rounded-full blur-3xl"></div>
      </div>

      <div className="relative p-8 md:p-12 text-center">
        <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-6 border border-white/20">
          <TreePine size={16} className="text-green-400" />
          Navidad 2025
        </span>

        <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
          {title || "Haz que tu Marca Brille esta Navidad"}
        </h3>

        <p className="text-red-100 text-lg max-w-2xl mx-auto mb-8">
          {subtitle || "Artículos promocionales navideños personalizados para sorprender a tus clientes y empleados."}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/tienda"
            className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2"
          >
            <Gift size={20} />
            Ver Catálogo Navideño
          </Link>
          <button
            onClick={handleWhatsApp}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 border border-white/30 flex items-center justify-center gap-2"
          >
            <MessageCircle size={20} />
            Cotizar por WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}

// Grid de categorías navideñas
function ChristmasCategoryGrid() {
  const categories = [
    {
      name: 'Tecnología',
      icon: Sparkles,
      color: 'from-blue-500 to-blue-600',
      description: 'Power banks, audífonos y gadgets',
      filter: 'tecnología'
    },
    {
      name: 'Drinkware',
      icon: Heart,
      color: 'from-red-500 to-red-600',
      description: 'Termos, tazas y botellas',
      filter: 'drinkware'
    },
    {
      name: 'Hogar',
      icon: TreePine,
      color: 'from-green-500 to-green-600',
      description: 'Cobijas, velas y decoración',
      filter: 'hogar'
    },
    {
      name: 'Oficina',
      icon: Gift,
      color: 'from-amber-500 to-amber-600',
      description: 'Agendas, sets ejecutivos',
      filter: 'oficina'
    },
  ];

  return (
    <div className="my-10 grid grid-cols-2 md:grid-cols-4 gap-4">
      {categories.map((cat) => (
        <Link
          key={cat.name}
          href={`/tienda?search=${encodeURIComponent(cat.filter)}`}
          className={`group bg-gradient-to-br ${cat.color} rounded-xl p-5 text-white hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl`}
        >
          <cat.icon className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" />
          <h4 className="font-bold text-lg mb-1">{cat.name}</h4>
          <p className="text-white/80 text-sm">{cat.description}</p>
        </Link>
      ))}
    </div>
  );
}

// Showcase de productos con tema navideño
function ChristmasProductShowcase({
  products,
  title,
  subtitle,
  bgColor = 'from-gray-900 to-gray-800'
}: {
  products: typeof productsData;
  title: string;
  subtitle?: string;
  bgColor?: string;
}) {
  const handleCotizar = (e: React.MouseEvent, productName: string) => {
    e.preventDefault();
    e.stopPropagation();
    const mensaje = `Hola! Me interesa cotizar para regalo navideño: ${productName}`;
    const whatsappUrl = `https://wa.me/593998594123?text=${encodeURIComponent(mensaje)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className={`my-10 bg-gradient-to-br ${bgColor} rounded-2xl overflow-hidden shadow-xl`}>
      <div className="p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-white">{title}</h3>
            {subtitle && <p className="text-gray-300 mt-1">{subtitle}</p>}
          </div>
          <Link
            href="/tienda"
            className="text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 text-sm"
          >
            Ver más <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.slice(0, 4).map((product) => (
            <Link
              key={product.id}
              href={`/tienda/${product.slug}`}
              className="group bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden hover:bg-white/20 transition-all duration-300 border border-white/10 hover:border-white/30"
            >
              <div className="relative h-28 md:h-36 bg-white/5 overflow-hidden">
                <img
                  src={product.imagen_url}
                  alt={product.nombre}
                  className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/img/placeholder-producto.svg'; }}
                />
              </div>
              <div className="p-3">
                <h4 className="text-white font-semibold text-sm line-clamp-2 mb-1 group-hover:text-amber-300 transition-colors">
                  {product.nombre}
                </h4>
                <span className="text-gray-400 text-xs">{product.categoria}</span>
                <button
                  onClick={(e) => handleCotizar(e, product.nombre)}
                  className="w-full mt-2 bg-amber-500 hover:bg-amber-600 text-white text-xs py-2 rounded-lg font-medium transition-colors"
                >
                  Cotizar
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function BlogNavidadContent() {
  const [tocOpen, setTocOpen] = useState(true);

  // Productos por categoría
  const drinkwareProducts = getProductsByCategory('Drinkware', 4);
  const techProducts = getProductsByCategory('Tecnología', 4);
  const officeProducts = getProductsByCategory('Oficina', 4);
  const ecoProducts = getProductsByCategory('Eco', 4);
  const hogarProducts = getProductsByCategory('Hogar', 4);

  return (
    <>
      {/* Tabla de Contenidos */}
      <div className="mb-10 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <button
          onClick={() => setTocOpen(!tocOpen)}
          className="w-full flex items-center justify-between p-6 bg-gradient-to-r from-red-50 to-green-50 hover:from-red-100 hover:to-green-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <TreePine className="text-green-600" size={24} />
            <h2 className="text-xl font-bold text-gray-900">Tabla de Contenidos</h2>
          </div>
          {tocOpen ? <ChevronUp size={24} className="text-red-600" /> : <ChevronDown size={24} className="text-red-600" />}
        </button>

        {tocOpen && (
          <nav className="p-6 pt-0">
            <ol className="space-y-2 text-gray-700">
              <li><a href="#intro" className="hover:text-red-600 transition-colors flex items-center gap-2"><span className="w-6 h-6 bg-red-100 text-red-900 rounded-full text-xs flex items-center justify-center font-bold">1</span> Introducción</a></li>
              <li><a href="#guia-definitiva" className="hover:text-red-600 transition-colors flex items-center gap-2"><span className="w-6 h-6 bg-red-100 text-red-900 rounded-full text-xs flex items-center justify-center font-bold">2</span> Guía Definitiva para Impulsar tu Marca</a></li>
              <li><a href="#beneficios" className="hover:text-red-600 transition-colors flex items-center gap-2"><span className="w-6 h-6 bg-red-100 text-red-900 rounded-full text-xs flex items-center justify-center font-bold">3</span> Beneficios Clave para tu Negocio</a></li>
              <li><a href="#ideas-creativas" className="hover:text-red-600 transition-colors flex items-center gap-2"><span className="w-6 h-6 bg-red-100 text-red-900 rounded-full text-xs flex items-center justify-center font-bold">4</span> Ideas Creativas para 2025</a></li>
              <li><a href="#segmentacion" className="hover:text-red-600 transition-colors flex items-center gap-2"><span className="w-6 h-6 bg-red-100 text-red-900 rounded-full text-xs flex items-center justify-center font-bold">5</span> Segmentación por Público Objetivo</a></li>
              <li><a href="#personalizacion" className="hover:text-red-600 transition-colors flex items-center gap-2"><span className="w-6 h-6 bg-red-100 text-red-900 rounded-full text-xs flex items-center justify-center font-bold">6</span> Cómo Personalizar tus Artículos</a></li>
              <li><a href="#proveedores" className="hover:text-red-600 transition-colors flex items-center gap-2"><span className="w-6 h-6 bg-red-100 text-red-900 rounded-full text-xs flex items-center justify-center font-bold">7</span> Dónde Comprar</a></li>
              <li><a href="#presupuesto" className="hover:text-red-600 transition-colors flex items-center gap-2"><span className="w-6 h-6 bg-red-100 text-red-900 rounded-full text-xs flex items-center justify-center font-bold">8</span> Presupuesto y Optimización</a></li>
              <li><a href="#distribucion" className="hover:text-red-600 transition-colors flex items-center gap-2"><span className="w-6 h-6 bg-red-100 text-red-900 rounded-full text-xs flex items-center justify-center font-bold">9</span> Estrategias de Distribución</a></li>
              <li><a href="#medicion" className="hover:text-red-600 transition-colors flex items-center gap-2"><span className="w-6 h-6 bg-red-100 text-red-900 rounded-full text-xs flex items-center justify-center font-bold">10</span> Medición del Éxito</a></li>
              <li><a href="#errores" className="hover:text-red-600 transition-colors flex items-center gap-2"><span className="w-6 h-6 bg-red-100 text-red-900 rounded-full text-xs flex items-center justify-center font-bold">11</span> Errores Comunes y Cómo Evitarlos</a></li>
              <li><a href="#sostenibles" className="hover:text-red-600 transition-colors flex items-center gap-2"><span className="w-6 h-6 bg-red-100 text-red-900 rounded-full text-xs flex items-center justify-center font-bold">12</span> Opciones Sostenibles</a></li>
              <li><a href="#faq" className="hover:text-red-600 transition-colors flex items-center gap-2"><span className="w-6 h-6 bg-red-100 text-red-900 rounded-full text-xs flex items-center justify-center font-bold">13</span> Preguntas Frecuentes</a></li>
              <li><a href="#conclusion" className="hover:text-red-600 transition-colors flex items-center gap-2"><span className="w-6 h-6 bg-red-100 text-red-900 rounded-full text-xs flex items-center justify-center font-bold">14</span> Conclusión</a></li>
            </ol>
          </nav>
        )}
      </div>

      {/* Contenido del artículo */}
      <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-a:text-red-600 prose-a:no-underline hover:prose-a:underline">

        {/* Introducción */}
        <section id="intro" className="scroll-mt-24">
          <p className="text-lg text-gray-700 leading-relaxed">
            ¿Listo para que tu marca brille más que el árbol de Navidad? En la jungla decembrina, destacar entre la multitud es crucial, y los <strong>artículos promocionales navideños</strong> son tu arma secreta. Esta guía definitiva te revelará cómo transformar regalos corporativos en una poderosa herramienta de marketing. Prepárate para descubrir ideas creativas, estrategias de segmentación y los beneficios clave que impulsarán tu negocio en estas fiestas. ¡Convierte la temporada navideña en una oportunidad de oro para tu marca!
          </p>
        </section>

        {/* CARRUSEL INTERACTIVO DE PRODUCTOS NAVIDEÑOS */}
        <ChristmasCarousel />

        {/* Guía Definitiva */}
        <section id="guia-definitiva" className="scroll-mt-24">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
            <TreePine className="text-green-600" />
            La Guía Definitiva para Impulsar tu Marca en Navidad
          </h2>

          <p>
            La temporada navideña ofrece una oportunidad inigualable para conectar con clientes y empleados a través de <strong>artículos promocionales</strong>. Una estrategia bien planificada no solo fortalece relaciones, sino que también aumenta la visibilidad de tu marca de una manera memorable y festiva.
          </p>

          <h3 className="text-xl font-bold text-gray-800 mt-8 mb-4">Elige Artículos que Resuenen con tu Audiencia</h3>

          <p>
            La clave para un <strong>regalo promocional</strong> exitoso reside en la relevancia. No se trata simplemente de poner tu logo en cualquier objeto; se trata de seleccionar artículos que tu público objetivo realmente valore y utilice.
          </p>

          <div className="bg-red-50 border-l-4 border-red-500 p-6 my-6 rounded-r-lg">
            <h4 className="font-bold text-red-900 mb-3 flex items-center gap-2">
              <Target size={20} />
              Claves para elegir el regalo perfecto:
            </h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <span><strong>Intereses:</strong> ¿Amantes de la cocina? Un set de utensilios. ¿Viajeros? Un power bank personalizado.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <span><strong>Presupuesto:</strong> Un pequeño detalle pensado con cariño puede ser más efectivo que un regalo costoso pero impersonal.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <span><strong>Durabilidad:</strong> Una taza de cerámica con diseño navideño puede ser un artículo duradero y apreciado.</span>
              </li>
            </ul>
          </div>

          <h3 className="text-xl font-bold text-gray-800 mt-8 mb-4">Personalización Creativa: Más Allá del Logo</h3>

          <p>
            Si bien es importante incluir tu logo, no te limites a eso. La <strong>personalización creativa</strong> puede marcar la diferencia y hacer que tu regalo sea realmente memorable.
          </p>

          <ul className="list-disc pl-6 space-y-2 my-4">
            <li>Incorpora un mensaje navideño personalizado para cada cliente o empleado.</li>
            <li>Utiliza colores y diseños que reflejen tanto tu marca como el espíritu navideño.</li>
            <li>Considera incluir un pequeño extra, como una tarjeta de agradecimiento o un cupón de descuento.</li>
          </ul>
        </section>

        {/* Grid de categorías navideñas */}
        <ChristmasCategoryGrid />

        {/* Beneficios */}
        <section id="beneficios" className="scroll-mt-24">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
            <TrendingUp className="text-green-600" />
            ¿Por Qué Invertir en Artículos Promocionales Navideños?
          </h2>

          <p>
            Invertir en <strong>artículos promocionales navideños</strong> es una estrategia inteligente para cerrar el año y comenzar el siguiente con una imagen positiva. Estos obsequios representan una oportunidad única para fortalecer relaciones y aumentar el reconocimiento de marca.
          </p>

          <div className="grid md:grid-cols-3 gap-6 my-8">
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Star className="text-blue-600" size={24} />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Visibilidad de Marca</h4>
              <p className="text-gray-600 text-sm">
                Un artículo bien elegido puede permanecer en la vida de tus clientes durante meses, manteniendo tu marca presente constantemente.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Heart className="text-red-600" size={24} />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Fortalece Relaciones</h4>
              <p className="text-gray-600 text-sm">
                Los regalos de empresa navideños demuestran aprecio y fortalecen la lealtad de clientes y empleados.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="text-green-600" size={24} />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Impulsa Ventas</h4>
              <p className="text-gray-600 text-sm">
                Incluir códigos de descuento y generar publicidad boca a boca puede contribuir a aumentar las ventas.
              </p>
            </div>
          </div>
        </section>

        {/* CTA de regalos */}
        <ChristmasCTA variant="gift" />

        {/* Ideas Creativas */}
        <section id="ideas-creativas" className="scroll-mt-24">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
            <Lightbulb className="text-amber-500" />
            Ideas Creativas de Artículos Promocionales Navideños para 2025
          </h2>

          <p>
            En la vorágine navideña, destacar con tus <strong>artículos promocionales</strong> requiere creatividad y una estrategia bien definida. Olvídate de los clichés y apuesta por opciones originales que dejen una huella duradera.
          </p>

          <h3 className="text-xl font-bold text-gray-800 mt-8 mb-4">Kits de Experiencias Navideñas Personalizadas</h3>

          <p>
            En lugar de un simple objeto, ofrece una experiencia. Un kit de experiencias navideñas puede incluir ingredientes para preparar galletas, un set de decoración para el árbol, o incluso un vale para una clase online de cocina navideña.
          </p>

          <div className="bg-amber-50 border-l-4 border-amber-500 p-6 my-6 rounded-r-lg">
            <p className="text-amber-900 font-medium">
              <strong>Tip:</strong> Incluye una tarjeta personalizada y adapta los kits a diferentes perfiles: familias con niños, amantes del vino, etc.
            </p>
          </div>

          <h3 className="text-xl font-bold text-gray-800 mt-8 mb-4">Artículos Eco-Amigables con Toque Navideño</h3>

          <p>
            La sostenibilidad es una tendencia en auge. Opta por <strong>artículos promocionales ecológicos</strong> como plantas en macetas con diseños navideños, bolígrafos de bambú o bolsas de tela reutilizables con motivos festivos.
          </p>

          <h3 className="text-xl font-bold text-gray-800 mt-8 mb-4">Tecnología Útil con Diseño Festivo</h3>

          <p>
            Un power bank con diseño elegante y festivo, auriculares inalámbricos con funda personalizada o un cargador USB con forma de adorno navideño son opciones prácticas y modernas.
          </p>
        </section>

        {/* Productos de tecnología */}
        <ChristmasProductShowcase
          products={techProducts}
          title="Productos Tecnológicos para Regalar"
          subtitle="Gadgets útiles que sorprenderán a tus clientes"
          bgColor="from-blue-900 to-blue-800"
        />

        {/* Segmentación */}
        <section id="segmentacion" className="scroll-mt-24">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
            <Users className="text-blue-600" />
            Artículos según tu Público Objetivo
          </h2>

          <p>
            Elegir los <strong>artículos promocionales navideños</strong> adecuados implica conocer a fondo a tu audiencia. Un enfoque segmentado puede maximizar el impacto de tu campaña.
          </p>

          <div className="grid md:grid-cols-2 gap-6 my-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
              <h4 className="font-bold text-blue-900 mb-4 text-lg flex items-center gap-2">
                <Users size={20} />
                Para Empleados
              </h4>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="text-blue-500" size={16} />
                  Tarjetas de regalo personalizadas
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="text-blue-500" size={16} />
                  Kits de bienestar con velas y tés
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="text-blue-500" size={16} />
                  Notas de agradecimiento personalizadas
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="text-blue-500" size={16} />
                  Experiencias gastronómicas o spa
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
              <h4 className="font-bold text-red-900 mb-4 text-lg flex items-center gap-2">
                <Heart size={20} />
                Para Clientes
              </h4>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="text-red-500" size={16} />
                  Calendarios personalizados con tu marca
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="text-red-500" size={16} />
                  Descuentos exclusivos para futuras compras
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="text-red-500" size={16} />
                  Regalos personalizados según intereses
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="text-red-500" size={16} />
                  Sets de productos gourmet locales
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA WhatsApp */}
        <ChristmasCTA variant="whatsapp" />

        {/* Personalización */}
        <section id="personalizacion" className="scroll-mt-24">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
            <Sparkles className="text-amber-500" />
            Cómo Personalizar tus Artículos Navideños
          </h2>

          <p>
            La magia de la Navidad reside en los detalles, y la <strong>personalización</strong> de tus artículos promocionales es la clave para conectar con tu audiencia de una forma más profunda.
          </p>

          <h3 className="text-xl font-bold text-gray-800 mt-8 mb-4">El Poder del Diseño Personalizado</h3>

          <p>
            Considera la paleta de colores de tu marca y cómo se integra con los motivos navideños. Experimenta con técnicas como serigrafía, bordado o impresión digital según el tipo de artículo.
          </p>

          <h3 className="text-xl font-bold text-gray-800 mt-8 mb-4">Mensajes que Conectan</h3>

          <p>
            Evita los mensajes genéricos y opta por frases que transmitan gratitud y buenos deseos. Considera añadir un código QR que dirija a una página web con un mensaje navideño o vídeo personalizado.
          </p>
        </section>

        {/* Productos de oficina */}
        <ChristmasProductShowcase
          products={officeProducts}
          title="Artículos de Oficina Navideños"
          subtitle="Perfectos para regalos ejecutivos"
          bgColor="from-gray-800 to-gray-900"
        />

        {/* Proveedores */}
        <section id="proveedores" className="scroll-mt-24">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
            <ShoppingBag className="text-green-600" />
            Dónde Comprar Artículos Promocionales Navideños
          </h2>

          <p>
            Encontrar los proveedores adecuados es crucial para el éxito de tu campaña. La calidad, el precio y la capacidad de personalización son factores clave a considerar.
          </p>

          <h3 className="text-xl font-bold text-gray-800 mt-8 mb-4">Proveedores Especializados</h3>

          <p>
            Estos proveedores ofrecen una amplia gama de productos y la capacidad de gestionar grandes pedidos. Busca proveedores con experiencia comprobada y solicita muestras antes de decidir.
          </p>

          <div className="bg-green-50 border-l-4 border-green-500 p-6 my-6 rounded-r-lg">
            <h4 className="font-bold text-green-900 mb-3">Tips al elegir proveedor:</h4>
            <ul className="space-y-2 text-green-800">
              <li>✓ Verifica referencias y experiencia comprobada</li>
              <li>✓ Solicita muestras de productos</li>
              <li>✓ Compara precios y tiempos de entrega</li>
              <li>✓ Pregunta por servicios de diseño gráfico</li>
            </ul>
          </div>
        </section>

        {/* Presupuesto */}
        <section id="presupuesto" className="scroll-mt-24">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
            <Calculator className="text-blue-600" />
            Presupuesto: Cómo Calcularlo y Optimizar
          </h2>

          <p>
            Planificar el presupuesto para tus <strong>artículos promocionales navideños</strong> es crucial para maximizar el retorno de la inversión.
          </p>

          <h3 className="text-xl font-bold text-gray-800 mt-8 mb-4">Calculando tu Presupuesto Base</h3>

          <ul className="list-disc pl-6 space-y-2 my-4">
            <li><strong>Objetivos de marketing:</strong> ¿Aumentar reconocimiento, fidelizar clientes o generar leads?</li>
            <li><strong>Tamaño de audiencia:</strong> ¿A cuántas personas quieres llegar?</li>
            <li><strong>Valor del cliente:</strong> ¿Cuánto vale un cliente para tu negocio?</li>
            <li><strong>ROI esperado:</strong> Un ROI más alto justifica una mayor inversión.</li>
          </ul>

          <h3 className="text-xl font-bold text-gray-800 mt-8 mb-4">Estrategias de Optimización</h3>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-6 rounded-r-lg">
            <ul className="space-y-2 text-blue-800">
              <li>✓ Compara precios entre varios proveedores</li>
              <li>✓ Negocia descuentos por volumen</li>
              <li>✓ Planifica con anticipación para mejores precios</li>
              <li>✓ Elige artículos estratégicos con alto valor percibido</li>
            </ul>
          </div>
        </section>

        {/* Productos Drinkware */}
        <ChristmasProductShowcase
          products={drinkwareProducts}
          title="Termos y Tazas Navideñas"
          subtitle="Los favoritos para regalos de temporada"
          bgColor="from-red-800 to-red-900"
        />

        {/* Distribución */}
        <section id="distribucion" className="scroll-mt-24">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
            <Truck className="text-green-600" />
            Estrategias de Distribución
          </h2>

          <p>
            Una estrategia de distribución bien pensada maximiza el alcance de tu campaña y asegura que los regalos lleguen a las manos correctas.
          </p>

          <h3 className="text-xl font-bold text-gray-800 mt-8 mb-4">Distribución Directa</h3>

          <p>
            Envía los artículos directamente a tus clientes más valiosos como muestra de agradecimiento. Para empleados, organiza una entrega especial en la oficina o envíalos a sus hogares.
          </p>

          <h3 className="text-xl font-bold text-gray-800 mt-8 mb-4">Eventos Navideños y Ferias</h3>

          <p>
            Aprovecha los eventos navideños para distribuir tus artículos. Establece un stand atractivo y considera organizar un sorteo o concurso para atraer más personas.
          </p>
        </section>

        {/* Medición */}
        <section id="medicion" className="scroll-mt-24">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
            <TrendingUp className="text-amber-500" />
            Medición del Éxito de tu Campaña
          </h2>

          <p>
            Medir el éxito de tu campaña no solo justifica el gasto, sino que también te proporciona información valiosa para futuras estrategias.
          </p>

          <h3 className="text-xl font-bold text-gray-800 mt-8 mb-4">KPIs Clave</h3>

          <div className="grid md:grid-cols-3 gap-4 my-6">
            <div className="bg-white rounded-lg p-4 shadow-md border border-gray-100 text-center">
              <Award className="w-8 h-8 mx-auto text-amber-500 mb-2" />
              <h5 className="font-bold text-gray-900">Tasa de Conversión</h5>
              <p className="text-gray-600 text-sm">Acciones realizadas por destinatarios</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md border border-gray-100 text-center">
              <TrendingUp className="w-8 h-8 mx-auto text-green-500 mb-2" />
              <h5 className="font-bold text-gray-900">ROI</h5>
              <p className="text-gray-600 text-sm">Retorno de la inversión</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md border border-gray-100 text-center">
              <Star className="w-8 h-8 mx-auto text-blue-500 mb-2" />
              <h5 className="font-bold text-gray-900">Visibilidad</h5>
              <p className="text-gray-600 text-sm">Alcance de marca logrado</p>
            </div>
          </div>

          <h3 className="text-xl font-bold text-gray-800 mt-8 mb-4">Herramientas de Seguimiento</h3>

          <ul className="list-disc pl-6 space-y-2 my-4">
            <li><strong>Google Analytics:</strong> Rastrea tráfico web generado</li>
            <li><strong>Códigos QR:</strong> Mide escaneos e interacciones</li>
            <li><strong>Encuestas:</strong> Recopila opinión de clientes</li>
          </ul>
        </section>

        {/* Errores Comunes */}
        <section id="errores" className="scroll-mt-24">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
            <HelpCircle className="text-red-600" />
            Errores Comunes y Cómo Evitarlos
          </h2>

          <p>
            Una elección incorrecta de <strong>artículos promocionales navideños</strong> puede resultar contraproducente. Evitar estos errores es esencial.
          </p>

          <div className="space-y-4 my-6">
            <div className="bg-red-50 rounded-xl p-5 border border-red-200">
              <h4 className="font-bold text-red-900 mb-2">No considerar el público objetivo</h4>
              <p className="text-gray-700 text-sm">
                Investiga a tu audiencia, segmenta y ofrece opciones que se adapten a sus gustos.
              </p>
            </div>
            <div className="bg-red-50 rounded-xl p-5 border border-red-200">
              <h4 className="font-bold text-red-900 mb-2">Descuidar la calidad y utilidad</h4>
              <p className="text-gray-700 text-sm">
                Prioriza durabilidad, elige artículos útiles y evita productos genéricos.
              </p>
            </div>
            <div className="bg-red-50 rounded-xl p-5 border border-red-200">
              <h4 className="font-bold text-red-900 mb-2">Ignorar la sostenibilidad</h4>
              <p className="text-gray-700 text-sm">
                Opta por materiales reciclados, promueve la reutilización y reduce el embalaje.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Eco */}
        <ChristmasCTA variant="eco" />

        {/* Sostenibles */}
        <section id="sostenibles" className="scroll-mt-24">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
            <Leaf className="text-green-600" />
            Artículos Navideños Sostenibles
          </h2>

          <p>
            Los <strong>artículos promocionales navideños sostenibles</strong> ofrecen una oportunidad única para conectar con valores de responsabilidad ambiental.
          </p>

          <h3 className="text-xl font-bold text-gray-800 mt-8 mb-4">Materiales Sostenibles</h3>

          <div className="grid md:grid-cols-2 gap-4 my-6">
            <div className="flex items-center gap-3 bg-green-50 p-4 rounded-lg">
              <Leaf className="text-green-600 flex-shrink-0" />
              <div>
                <strong>Bambú:</strong> Ideal para bolígrafos y utensilios
              </div>
            </div>
            <div className="flex items-center gap-3 bg-green-50 p-4 rounded-lg">
              <Leaf className="text-green-600 flex-shrink-0" />
              <div>
                <strong>Algodón Orgánico:</strong> Perfecto para bolsas y textiles
              </div>
            </div>
            <div className="flex items-center gap-3 bg-green-50 p-4 rounded-lg">
              <Leaf className="text-green-600 flex-shrink-0" />
              <div>
                <strong>Materiales Reciclados:</strong> Papel, plástico y más
              </div>
            </div>
            <div className="flex items-center gap-3 bg-green-50 p-4 rounded-lg">
              <Leaf className="text-green-600 flex-shrink-0" />
              <div>
                <strong>Corcho:</strong> Para posavasos y accesorios
              </div>
            </div>
          </div>

          <h3 className="text-xl font-bold text-gray-800 mt-8 mb-4">Ideas Eco-Friendly</h3>

          <ul className="list-disc pl-6 space-y-2 my-4">
            <li><strong>Kits de Semillas:</strong> Regalo original para cultivar en casa</li>
            <li><strong>Bolsas Reutilizables:</strong> Diseños atractivos y mensajes inspiradores</li>
            <li><strong>Botellas de Acero:</strong> Alternativa duradera al plástico</li>
            <li><strong>Velas de Cera de Soja:</strong> Naturales y biodegradables</li>
          </ul>
        </section>

        {/* Productos Eco */}
        <ChristmasProductShowcase
          products={ecoProducts.length > 0 ? ecoProducts : hogarProducts}
          title="Productos Eco-Friendly"
          subtitle="Opciones sostenibles para una Navidad verde"
          bgColor="from-emerald-800 to-teal-800"
        />

        {/* FAQ */}
        <section id="faq" className="scroll-mt-24">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
            <HelpCircle className="text-blue-600" />
            Preguntas Frecuentes
          </h2>

          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Clock className="text-amber-500" size={20} />
                ¿Con cuánto tiempo de anticipación debo ordenar?
              </h4>
              <p className="text-gray-700">
                Lo ideal es comenzar a planificar 2-3 meses antes. Esto te da tiempo para investigar, diseñar, producir y gestionar el envío evitando retrasos en temporada alta.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Calculator className="text-blue-500" size={20} />
                ¿Cómo calculo el presupuesto adecuado?
              </h4>
              <p className="text-gray-700">
                Considera cantidad de artículos, tipo de producto, costos de personalización y envío. Una regla general es destinar 1-5% de ingresos anuales a marketing promocional.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <TrendingUp className="text-green-500" size={20} />
                ¿Cómo mido el éxito de la campaña?
              </h4>
              <p className="text-gray-700">
                Utiliza códigos QR, URLs personalizadas, encuestas de satisfacción y compara ventas antes y después de la campaña para evaluar el impacto.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Gift className="text-red-500" size={20} />
                ¿Qué artículos son más efectivos?
              </h4>
              <p className="text-gray-700">
                Los más efectivos son los útiles (tazas, termos, calendarios), festivos (adornos, sets navideños) y de alta calidad que reflejen la identidad de tu marca.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Principal */}
        <ChristmasCTA variant="primary" />

        {/* Conclusión */}
        <section id="conclusion" className="scroll-mt-24">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-12 mb-6">
            Conclusión
          </h2>

          <p>
            La temporada navideña representa una oportunidad dorada para conectar con tu audiencia a través de la alegría y el espíritu festivo. Los <strong>artículos promocionales navideños</strong>, diseñados estratégicamente y segmentados para tu público objetivo, no solo fortalecen el reconocimiento de tu marca, sino que también fomentan la lealtad y generan un impacto duradero.
          </p>

          <p>
            Más allá de un simple obsequio, los artículos promocionales navideños se convierten en una inversión inteligente que impulsa el crecimiento de tu negocio y te diferencia de la competencia. En un mercado saturado, la originalidad y la atención al detalle son cruciales para captar la atención.
          </p>

          <div className="bg-gradient-to-r from-red-900 to-green-900 rounded-2xl p-8 my-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center justify-center gap-3">
              <TreePine className="text-green-400" />
              ¡Haz que esta Navidad sea inolvidable!
            </h3>
            <p className="text-red-100 mb-6">
              Contacta hoy mismo y descubre cómo podemos ayudarte a diseñar los artículos promocionales navideños perfectos para tu marca.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/tienda"
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300"
              >
                <Gift size={20} />
                Explorar Catálogo Navideño
              </Link>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
