'use client';

import { useState, useRef, useEffect } from 'react';
import { ShoppingCart, Tag, Eye } from 'lucide-react';
import Link from 'next/link';

interface Product {
  id: string;
  nombre: string;
  slug: string;
  categoria: string;
  descripcion_corta: string;
  imagen_url: string;
  codigo?: string | null;
}

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priority) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px', threshold: 0.01 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const handleCotizar = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const mensaje = `Hola! Me interesa cotizar el producto: ${product.nombre}`;
    const whatsappUrl = `https://wa.me/593998594123?text=${encodeURIComponent(mensaje)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Link
      href={`/tienda/${product.slug}`}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group block border border-gray-100 hover:border-blue-200 transform hover:-translate-y-1"
    >
      <div
        ref={imgRef}
        className="relative h-40 sm:h-48 md:h-52 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden"
      >
        {!isLoaded && isInView && (
          <div className="absolute inset-0 bg-gray-100 animate-pulse" />
        )}

        {isInView && (
          <img
            src={imageError ? "/img/placeholder-producto.svg" : product.imagen_url}
            alt={product.nombre}
            loading={priority ? "eager" : "lazy"}
            onError={() => setImageError(true)}
            onLoad={() => setIsLoaded(true)}
            className={`w-full h-full object-contain p-3 md:p-4 group-hover:scale-105 transition-all duration-500 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        <div className="absolute top-1.5 left-1.5 md:top-2 md:left-2">
          <span className="inline-flex items-center gap-1 bg-blue-900/90 backdrop-blur-sm text-white text-[10px] md:text-xs font-medium px-2 py-1 rounded-full shadow">
            <Tag size={10} className="hidden sm:block" />
            <span className="truncate max-w-[80px] sm:max-w-none">{product.categoria}</span>
          </span>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-3 md:p-4">
        <h3 className="text-sm md:text-base font-bold text-blue-900 mb-1.5 line-clamp-2 min-h-[2.25rem] md:min-h-[2.75rem] group-hover:text-blue-700 transition-colors">
          {product.nombre}
        </h3>

        <p className="text-gray-600 text-xs md:text-sm mb-3 line-clamp-2 min-h-[2rem] md:min-h-[2.5rem]">
          {product.descripcion_corta}
        </p>

        <div className="space-y-2">
          <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white px-3 py-2 md:py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 group-hover:shadow-md text-sm">
            <Eye size={14} className="md:w-4 md:h-4" />
            <span>Ver Detalles</span>
          </div>

          <button
            onClick={handleCotizar}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white px-3 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 text-xs md:text-sm shadow-sm hover:shadow"
          >
            <ShoppingCart size={14} />
            <span>Cotizar</span>
          </button>
        </div>
      </div>
    </Link>
  );
}
