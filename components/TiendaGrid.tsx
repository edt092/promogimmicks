'use client';

import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Search, X, ShoppingCart } from 'lucide-react';
import ProductCard from './ProductCard';
import productsDataRaw from '../data/products.json';

interface Product {
  id: string;
  nombre: string;
  slug: string;
  categoria: string;
  categoria_slug: string;
  descripcion_corta: string;
  imagen_url: string;
  imagen_original_url: string;
  codigo: string | null;
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
}

const productsData = productsDataRaw as Product[];

const PRODUCTS_PER_PAGE = 20;

export default function TiendaGrid() {
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleProducts, setVisibleProducts] = useState(PRODUCTS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  const filteredProducts = useMemo(() => {
    if (searchTerm === '') return productsData;

    return productsData.filter(product => {
      return product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.descripcion_corta.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.codigo && product.codigo.toLowerCase().includes(searchTerm.toLowerCase()));
    });
  }, [searchTerm]);

  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleProducts);
  }, [filteredProducts, visibleProducts]);

  useEffect(() => {
    setVisibleProducts(PRODUCTS_PER_PAGE);
  }, [searchTerm]);

  const loadMore = useCallback(() => {
    if (isLoading || visibleProducts >= filteredProducts.length) return;
    setIsLoading(true);
    setTimeout(() => {
      setVisibleProducts(prev => Math.min(prev + PRODUCTS_PER_PAGE, filteredProducts.length));
      setIsLoading(false);
    }, 300);
  }, [isLoading, visibleProducts, filteredProducts.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );
    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <div className="min-h-screen">
      <div className="sticky top-16 z-40 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 py-4 -mx-4 px-4 md:-mx-6 md:px-6 lg:-mx-8 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Buscar productos, categorías..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-10 py-3.5 text-base border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <p className="text-sm text-gray-500 text-center sm:text-right whitespace-nowrap">
              <span className="font-semibold text-gray-900">{filteredProducts.length}</span> productos
              {searchTerm && (
                <span className="ml-2 text-amber-600">
                  para &quot;{searchTerm}&quot;
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        {displayedProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-5">
              {displayedProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} priority={index < 10} />
              ))}
            </div>

            {visibleProducts < filteredProducts.length && (
              <div ref={loaderRef} className="flex justify-center items-center py-12">
                {isLoading ? (
                  <div className="flex items-center gap-3 text-gray-500">
                    <div className="w-6 h-6 border-2 border-blue-900 border-t-transparent rounded-full animate-spin" />
                    <span>Cargando más productos...</span>
                  </div>
                ) : (
                  <button
                    onClick={loadMore}
                    className="px-6 py-3 bg-blue-900 text-white rounded-lg font-medium hover:bg-blue-800 transition-colors"
                  >
                    Cargar más productos
                  </button>
                )}
              </div>
            )}

            {visibleProducts >= filteredProducts.length && filteredProducts.length > PRODUCTS_PER_PAGE && (
              <div className="text-center py-8 text-gray-500">
                Has visto todos los {filteredProducts.length} productos
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 max-w-md mx-auto">
              <ShoppingCart className="mx-auto text-gray-300 mb-6" size={80} />
              <h3 className="text-2xl font-bold text-gray-700 mb-3">No encontramos productos</h3>
              <p className="text-gray-500 text-base mb-6">
                No hay resultados para &quot;{searchTerm}&quot;
              </p>
              <button
                onClick={() => setSearchTerm('')}
                className="bg-blue-900 hover:bg-blue-800 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Ver todos los productos
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
