'use client';

import { useState } from 'react';
import { ShoppingCart, Tag } from 'lucide-react';
import Image from 'next/image';

interface Product {
  id: string;
  nombre: string;
  slug: string;
  categoria: string;
  descripcion_corta: string;
  imagen_url: string;
  precio?: number;
  fuente: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);

  const handleCotizar = () => {
    const mensaje = `Hola! Me interesa cotizar el producto: ${product.nombre}`;
    const whatsappUrl = `https://wa.me/593999999999?text=${encodeURIComponent(mensaje)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <a
      href={`/tienda/${product.slug}`}
      className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group block border border-gray-100 hover:border-blue-200 transform hover:-translate-y-1"
    >
      {/* Imagen del producto */}
      <div className="relative h-48 md:h-56 lg:h-64 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        <img
          src={imageError ? "/img/placeholder-producto.svg" : product.imagen_url}
          alt={product.nombre}
          onError={() => setImageError(true)}
          className="w-full h-full object-contain p-4 md:p-6 group-hover:scale-110 transition-transform duration-500"
        />

        {/* Badge de categoría */}
        <div className="absolute top-2 left-2 md:top-3 md:left-3">
          <span className="inline-flex items-center gap-1 bg-blue-900/95 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1.5 md:px-3 md:py-1.5 rounded-full shadow-lg">
            <Tag size={12} />
            <span className="hidden sm:inline">{product.categoria}</span>
          </span>
        </div>

        {/* Overlay hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Contenido */}
      <div className="p-4 md:p-5">
        <h3 className="text-base md:text-lg font-bold text-blue-900 mb-2 line-clamp-2 min-h-[2.5rem] md:min-h-[3.5rem] group-hover:text-blue-700 transition-colors">
          {product.nombre}
        </h3>

        <p className="text-gray-600 text-xs md:text-sm mb-4 line-clamp-2 md:line-clamp-3 min-h-[2.5rem] md:min-h-[4rem]">
          {product.descripcion_corta}
        </p>

        {/* Botones de acción */}
        <div className="space-y-2">
          {/* Botón principal - Ver detalles */}
          <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white px-4 py-2.5 md:py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 group-hover:shadow-lg">
            <span className="text-sm md:text-base">Ver Detalles</span>
            <span className="transform group-hover:translate-x-1 transition-transform">→</span>
          </div>

          {/* Botón secundario - Cotizar rápido */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleCotizar();
            }}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 md:py-2.5 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 text-sm md:text-base shadow-sm hover:shadow-md"
          >
            <ShoppingCart size={16} className="md:w-5 md:h-5" />
            <span>Cotizar Ahora</span>
          </button>
        </div>
      </div>
    </a>
  );
}
