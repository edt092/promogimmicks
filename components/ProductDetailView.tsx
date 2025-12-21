'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart, ArrowLeft, Tag, Share2, Check, MessageCircle, Truck, Award, Shield } from 'lucide-react';
import Link from 'next/link';
import productsData from '../data/products.json';

interface Product {
  id: string;
  nombre: string;
  slug: string;
  categoria: string;
  categoria_slug: string;
  descripcion_corta: string;
  imagen_url: string;
  codigo?: string | null;
}

interface ProductDetailViewProps {
  product: Product;
}

export default function ProductDetailView({ product }: ProductDetailViewProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [copied, setCopied] = useState(false);

  const relatedProducts = productsData
    .filter(p => p.categoria === product.categoria && p.id !== product.id)
    .slice(0, 4);

  const handleCotizar = () => {
    const mensaje = `Hola! Me interesa cotizar el producto: ${product.nombre}\n\nCategoría: ${product.categoria}${product.codigo ? `\nCódigo: ${product.codigo}` : ''}\n\n¿Podrían enviarme información sobre precios, cantidades mínimas y opciones de personalización?`;
    const whatsappUrl = `https://wa.me/593998594123?text=${encodeURIComponent(mensaje)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleShare = async () => {
    const shareData = {
      title: product.nombre,
      text: product.descripcion_corta,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <nav className="mb-6 md:mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
          <Link href="/" className="hover:text-blue-900 transition-colors">Inicio</Link>
          <span>/</span>
          <Link href="/tienda" className="hover:text-blue-900 transition-colors">Tienda</Link>
          <span>/</span>
          <span className="text-blue-900 font-medium truncate max-w-[200px]">{product.nombre}</span>
        </div>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-lg p-4 md:p-8 relative overflow-hidden">
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-100 animate-pulse rounded-lg" />
            )}
            <div className="aspect-square flex items-center justify-center bg-gradient-to-br from-gray-50 to-white rounded-xl">
              <img
                src={product.imagen_url}
                alt={product.nombre}
                onLoad={() => setImageLoaded(true)}
                className={`max-w-full max-h-full object-contain transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              />
            </div>
          </div>

          {product.codigo && (
            <div className="text-center text-sm text-gray-500">
              Código de referencia: <span className="font-medium text-gray-700">{product.codigo}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <div className="mb-4">
            <Link
              href={`/tienda?categoria=${product.categoria}`}
              className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-900 text-sm font-semibold px-4 py-2 rounded-full hover:bg-blue-200 transition-colors"
            >
              <Tag size={14} />
              {product.categoria}
            </Link>
          </div>

          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-blue-900 mb-4 leading-tight">
            {product.nombre}
          </h1>

          <div className="mb-6 md:mb-8">
            <p className="text-base md:text-lg text-gray-700 leading-relaxed">
              {product.descripcion_corta}
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 md:p-6 mb-6 md:mb-8 border border-blue-100">
            <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
              <Check className="text-green-500" size={20} />
              Incluye personalización profesional
            </h3>
            <ul className="space-y-3">
              {[
                'Impresión de logo en alta calidad',
                'Múltiples técnicas de marcado disponibles',
                'Asesoría de diseño incluida'
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-gray-700">
                  <Check className="text-amber-500 flex-shrink-0 mt-0.5" size={16} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3 mb-8">
            <button
              onClick={handleCotizar}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-6 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <MessageCircle size={22} />
              Solicitar Cotización por WhatsApp
            </button>

            <button
              onClick={handleShare}
              className="w-full bg-white hover:bg-gray-50 text-blue-900 px-6 py-3.5 rounded-xl font-semibold border-2 border-blue-200 hover:border-blue-300 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Share2 size={18} />
              {copied ? '¡Enlace copiado!' : 'Compartir Producto'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200">
            {[
              { icon: Award, title: 'Calidad Premium', desc: 'Materiales de primera' },
              { icon: Truck, title: 'Envío Nacional', desc: 'A todo Ecuador' },
              { icon: Shield, title: 'Garantía', desc: 'Satisfacción total' },
              { icon: MessageCircle, title: 'Soporte', desc: 'Asesoría personalizada' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                <item.icon className="text-blue-900 flex-shrink-0" size={20} />
                <div>
                  <p className="font-semibold text-blue-900 text-sm">{item.title}</p>
                  <p className="text-xs text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="mt-12 md:mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-blue-900">
              Productos Relacionados
            </h2>
            <Link
              href={`/tienda?categoria=${product.categoria}`}
              className="text-blue-900 hover:text-amber-500 font-medium text-sm flex items-center gap-1 transition-colors"
            >
              Ver todos
              <span>→</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((relProduct) => (
              <Link
                key={relProduct.id}
                href={`/tienda/${relProduct.slug}`}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group border border-gray-100 hover:border-blue-200"
              >
                <div className="aspect-square bg-gray-50 p-4">
                  <img
                    src={relProduct.imagen_url}
                    alt={relProduct.nombre}
                    loading="lazy"
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-semibold text-blue-900 line-clamp-2 group-hover:text-blue-700 transition-colors">
                    {relProduct.nombre}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8">
        <Link
          href="/tienda"
          className="inline-flex items-center text-blue-900 hover:text-amber-500 transition-colors font-medium"
        >
          <ArrowLeft size={18} className="mr-2" />
          Volver a la tienda
        </Link>
      </div>
    </div>
  );
}
