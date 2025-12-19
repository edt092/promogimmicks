'use client';

import { ShoppingCart, ArrowLeft, Tag, Share2 } from 'lucide-react';
import Link from 'next/link';

interface Product {
  id: string;
  nombre: string;
  slug: string;
  categoria: string;
  categoria_slug: string;
  descripcion_corta: string;
  imagen_url: string;
}

interface ProductDetailViewProps {
  product: Product;
}

export default function ProductDetailView({ product }: ProductDetailViewProps) {
  const handleCotizar = () => {
    const mensaje = `Hola! Me interesa cotizar el producto: ${product.nombre}\n\nCategoría: ${product.categoria}\n\n¿Podrían enviarme más información sobre precios, cantidades mínimas y opciones de personalización?`;
    const whatsappUrl = `https://wa.me/593999999999?text=${encodeURIComponent(mensaje)}`;
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
        console.log('Error al compartir');
      }
    } else {
      // Fallback: copiar URL
      navigator.clipboard.writeText(window.location.href);
      alert('Enlace copiado al portapapeles');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <div className="mb-8">
        <Link
          href="/tienda"
          className="inline-flex items-center text-blue-900 hover:text-amber-500 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Volver a la tienda
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Imagen del producto */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="aspect-square flex items-center justify-center bg-gray-50 rounded-lg">
            <img
              src={product.imagen_url}
              alt={product.nombre}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>

        {/* Información del producto */}
        <div className="flex flex-col">
          {/* Badge de categoría */}
          <div className="mb-4">
            <Link
              href={`/tienda?categoria=${product.categoria}`}
              className="inline-flex items-center gap-1 bg-blue-100 text-blue-900 text-sm font-semibold px-4 py-2 rounded-full hover:bg-blue-200 transition-colors"
            >
              <Tag size={16} />
              {product.categoria}
            </Link>
          </div>

          {/* Título */}
          <h1 className="text-4xl font-bold text-blue-900 mb-4">
            {product.nombre}
          </h1>

          {/* Descripción */}
          <div className="mb-8">
            <p className="text-lg text-gray-700 leading-relaxed">
              {product.descripcion_corta}
            </p>
          </div>

          {/* Características destacadas */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h3 className="font-bold text-blue-900 mb-3">Características:</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">✓</span>
                Personalización con tu logo
              </li>
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">✓</span>
                Alta calidad garantizada
              </li>
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">✓</span>
                Ideal para eventos corporativos
              </li>
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">✓</span>
                Entrega en todo Ecuador
              </li>
            </ul>
          </div>

          {/* Botones de acción */}
          <div className="space-y-4">
            <button
              onClick={handleCotizar}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
            >
              <ShoppingCart size={24} />
              Solicitar Cotización por WhatsApp
            </button>

            <button
              onClick={handleShare}
              className="w-full bg-white hover:bg-gray-50 text-blue-900 px-8 py-4 rounded-lg font-semibold border-2 border-blue-900 transition-colors duration-200 flex items-center justify-center gap-3"
            >
              <Share2 size={20} />
              Compartir Producto
            </button>
          </div>

          {/* Info adicional */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="font-bold text-blue-900 mb-3">¿Por qué elegirnos?</h3>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <p className="font-semibold text-blue-900">🎨 Personalización</p>
                <p>Impresión de alta calidad</p>
              </div>
              <div>
                <p className="font-semibold text-blue-900">📦 Stock disponible</p>
                <p>Entregas rápidas</p>
              </div>
              <div>
                <p className="font-semibold text-blue-900">💰 Mejores precios</p>
                <p>Cotización sin compromiso</p>
              </div>
              <div>
                <p className="font-semibold text-blue-900">🤝 Asesoría</p>
                <p>Atención personalizada</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de productos relacionados (próximamente) */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-blue-900 mb-6">
          Más productos de {product.categoria}
        </h2>
        <div className="bg-blue-50 rounded-lg p-8 text-center">
          <p className="text-gray-600">
            <Link href="/tienda" className="text-blue-900 font-semibold hover:text-amber-500">
              Ver todos los productos de {product.categoria}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
