'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Eye, Star, ArrowRight } from 'lucide-react';

interface Product {
  id: string;
  nombre: string;
  slug: string;
  categoria: string;
  descripcion_corta: string;
  imagen_url: string;
}

interface ProductShowcaseProps {
  products: Product[];
  title: string;
  subtitle?: string;
  variant?: 'default' | 'featured' | 'compact';
}

export default function ProductShowcase({
  products,
  title,
  subtitle,
  variant = 'default'
}: ProductShowcaseProps) {
  const handleCotizar = (e: React.MouseEvent, productName: string) => {
    e.preventDefault();
    e.stopPropagation();
    const mensaje = `Hola! Me interesa cotizar el producto: ${productName}`;
    const whatsappUrl = `https://wa.me/593998594123?text=${encodeURIComponent(mensaje)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (variant === 'featured') {
    return (
      <div className="my-12 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-400 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              <Star size={14} className="fill-amber-400" />
              Productos Destacados
            </span>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{title}</h3>
            {subtitle && <p className="text-blue-200">{subtitle}</p>}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {products.slice(0, 4).map((product) => (
              <ProductCardFeatured
                key={product.id}
                product={product}
                onCotizar={handleCotizar}
              />
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-8">
            <Link
              href="/tienda"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Ver todos los productos
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="my-8 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-blue-100">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-bold text-blue-900">{title}</h4>
          <Link
            href="/tienda"
            className="text-sm text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1"
          >
            Ver más <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {products.slice(0, 3).map((product) => (
            <ProductCardCompact
              key={product.id}
              product={product}
              onCotizar={handleCotizar}
            />
          ))}
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className="my-10 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 p-6">
        <h3 className="text-xl md:text-2xl font-bold text-white">{title}</h3>
        {subtitle && <p className="text-blue-200 mt-1">{subtitle}</p>}
      </div>

      {/* Products */}
      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.slice(0, 4).map((product) => (
            <ProductCardDefault
              key={product.id}
              product={product}
              onCotizar={handleCotizar}
            />
          ))}
        </div>

        <div className="text-center mt-6 pt-6 border-t border-gray-100">
          <Link
            href="/tienda"
            className="inline-flex items-center gap-2 text-blue-900 hover:text-amber-600 font-semibold transition-colors"
          >
            Explorar catálogo completo
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}

function ProductCardFeatured({
  product,
  onCotizar
}: {
  product: Product;
  onCotizar: (e: React.MouseEvent, name: string) => void;
}) {
  const [imageError, setImageError] = useState(false);

  return (
    <Link
      href={`/tienda/${product.slug}`}
      className="group bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden hover:bg-white/20 transition-all duration-300 border border-white/10 hover:border-white/30"
    >
      <div className="relative h-32 md:h-40 bg-white/5 overflow-hidden">
        <img
          src={imageError ? "/img/placeholder-producto.svg" : product.imagen_url}
          alt={product.nombre}
          onError={() => setImageError(true)}
          className="w-full h-full object-contain p-3 group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      <div className="p-3 md:p-4">
        <h4 className="text-white font-semibold text-sm line-clamp-2 mb-2 group-hover:text-amber-400 transition-colors">
          {product.nombre}
        </h4>
        <span className="text-blue-300 text-xs">{product.categoria}</span>
        <button
          onClick={(e) => onCotizar(e, product.nombre)}
          className="w-full mt-3 bg-amber-500 hover:bg-amber-600 text-white text-xs py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-1"
        >
          <ShoppingCart size={12} />
          Cotizar
        </button>
      </div>
    </Link>
  );
}

function ProductCardCompact({
  product,
  onCotizar
}: {
  product: Product;
  onCotizar: (e: React.MouseEvent, name: string) => void;
}) {
  const [imageError, setImageError] = useState(false);

  return (
    <Link
      href={`/tienda/${product.slug}`}
      className="group flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
    >
      <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
        <img
          src={imageError ? "/img/placeholder-producto.svg" : product.imagen_url}
          alt={product.nombre}
          onError={() => setImageError(true)}
          className="w-full h-full object-contain p-1 group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-blue-900 font-semibold text-sm line-clamp-2 group-hover:text-amber-600 transition-colors">
          {product.nombre}
        </h4>
        <span className="text-gray-500 text-xs">{product.categoria}</span>
      </div>
    </Link>
  );
}

function ProductCardDefault({
  product,
  onCotizar
}: {
  product: Product;
  onCotizar: (e: React.MouseEvent, name: string) => void;
}) {
  const [imageError, setImageError] = useState(false);

  return (
    <Link
      href={`/tienda/${product.slug}`}
      className="group bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-200"
    >
      <div className="relative h-28 md:h-36 bg-white overflow-hidden">
        <img
          src={imageError ? "/img/placeholder-producto.svg" : product.imagen_url}
          alt={product.nombre}
          onError={() => setImageError(true)}
          className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      <div className="p-3">
        <h4 className="text-blue-900 font-semibold text-sm line-clamp-2 mb-1 group-hover:text-amber-600 transition-colors">
          {product.nombre}
        </h4>
        <span className="text-gray-500 text-xs">{product.categoria}</span>
        <div className="flex gap-2 mt-2">
          <span className="flex-1 text-center bg-blue-900 text-white text-xs py-1.5 rounded-md font-medium">
            Ver
          </span>
          <button
            onClick={(e) => onCotizar(e, product.nombre)}
            className="flex-1 bg-amber-500 hover:bg-amber-600 text-white text-xs py-1.5 rounded-md font-medium transition-colors"
          >
            Cotizar
          </button>
        </div>
      </div>
    </Link>
  );
}
