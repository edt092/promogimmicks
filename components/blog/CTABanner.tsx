'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ShoppingBag, MessageCircle, Sparkles, Gift } from 'lucide-react';

// Componente con efecto de brillo dorado dinámico
function GoldenShimmerBadge() {
  const [shimmerPosition, setShimmerPosition] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setShimmerPosition((prev) => (prev >= 100 ? 0 : prev + 2));
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-8 border border-amber-500/30 overflow-hidden">
      {/* Efecto de brillo dorado que recorre el borde */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: `conic-gradient(from ${shimmerPosition * 3.6}deg at 50% 50%, transparent 0deg, #FFD700 20deg, #FFA500 40deg, transparent 60deg, transparent 360deg)`,
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'xor',
          WebkitMaskComposite: 'xor',
          padding: '3px',
        }}
      />

      {/* Brillo interno animado */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          background: `linear-gradient(${shimmerPosition * 3.6}deg, transparent 0%, #FFD700 50%, transparent 100%)`,
        }}
      />

      <div className="relative z-10 text-center">
        <Gift className="text-amber-400 mx-auto mb-4" size={48} />
        <div className="relative inline-block">
          <span
            className="text-5xl font-black bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(90deg, #FFD700 ${shimmerPosition - 20}%, #FFFFFF ${shimmerPosition}%, #FFD700 ${shimmerPosition + 20}%)`,
              backgroundSize: '200% 100%',
            }}
          >
            100%
          </span>
        </div>
        <p
          className="text-2xl font-bold mt-2 bg-clip-text text-transparent"
          style={{
            backgroundImage: `linear-gradient(90deg, #FFA500 ${shimmerPosition - 30}%, #FFD700 ${shimmerPosition}%, #FFA500 ${shimmerPosition + 30}%)`,
            backgroundSize: '200% 100%',
          }}
        >
          Personalizables
        </p>
      </div>
    </div>
  );
}

interface CTABannerProps {
  variant?: 'primary' | 'secondary' | 'inline' | 'whatsapp';
  title?: string;
  subtitle?: string;
}

export default function CTABanner({
  variant = 'primary',
  title,
  subtitle
}: CTABannerProps) {
  const handleWhatsApp = () => {
    const mensaje = "Hola! Vengo del blog y me gustaría cotizar productos promocionales para mi empresa.";
    const whatsappUrl = `https://wa.me/593998594123?text=${encodeURIComponent(mensaje)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (variant === 'whatsapp') {
    return (
      <div className="my-10 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
              <MessageCircle size={28} className="text-white" />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-white">
                {title || "¿Necesitas asesoría personalizada?"}
              </h3>
              <p className="text-green-100">
                {subtitle || "Nuestro equipo está listo para ayudarte"}
              </p>
            </div>
          </div>
          <button
            onClick={handleWhatsApp}
            className="bg-white hover:bg-gray-100 text-green-600 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2"
          >
            Chatear por WhatsApp
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className="my-8 p-5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border-l-4 border-amber-500">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Sparkles className="text-amber-500 flex-shrink-0 mt-0.5" size={24} />
            <div>
              <h4 className="font-bold text-blue-900">
                {title || "Encuentra el producto perfecto para tu marca"}
              </h4>
              <p className="text-gray-600 text-sm">
                {subtitle || "Más de 199 productos personalizables disponibles"}
              </p>
            </div>
          </div>
          <Link
            href="/tienda"
            className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            Ver productos
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  if (variant === 'secondary') {
    return (
      <div className="my-10 bg-gray-900 rounded-2xl overflow-hidden">
        <div className="p-8 md:p-10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full text-sm font-medium mb-4">
                <Gift size={14} />
                Catálogo 2025
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                {title || "Productos Promocionales Premium"}
              </h3>
              <p className="text-gray-400 mb-6">
                {subtitle || "Personalización de alta calidad con tu logo. Ideales para eventos, ferias y campañas corporativas."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/tienda"
                  className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={18} />
                  Explorar Tienda
                </Link>
                <button
                  onClick={handleWhatsApp}
                  className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-semibold transition-colors border border-white/20 flex items-center justify-center gap-2"
                >
                  <MessageCircle size={18} />
                  Cotizar Ahora
                </button>
              </div>
            </div>
            <div className="hidden md:flex justify-center items-center">
              <GoldenShimmerBadge />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Primary variant (default)
  return (
    <div className="my-12 relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 shadow-2xl">
      {/* Decoración */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400 rounded-full blur-3xl"></div>
      </div>

      <div className="relative p-8 md:p-12 text-center">
        <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-6 border border-white/20">
          <Sparkles size={16} className="text-amber-400" />
          Productos Promocionales Ecuador
        </span>

        <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
          {title || "Impulsa tu Marca con los Mejores Productos Promocionales"}
        </h3>

        <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-8">
          {subtitle || "Encuentra artículos publicitarios de calidad, personalizados con tu logo. Entrega en todo Ecuador."}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/tienda"
            className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2"
          >
            <ShoppingBag size={20} />
            Ver Catálogo Completo
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
