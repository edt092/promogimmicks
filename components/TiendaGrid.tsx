'use client';

import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Search, Filter, X, ShoppingCart } from 'lucide-react';
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
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [visibleProducts, setVisibleProducts] = useState(PRODUCTS_PER_PAGE);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  const categories = useMemo(() => {
    const catsInData = Array.from(new Set(productsData.map(p => p.categoria)));
    const orderedCats = [
      'Todas',
      'Accesorios',
      'Artículos de Escritura',
      'Bolsos y Mochilas',
      'Deportes y Recreación',
      'Drinkware',
      'Eco',
      'Hogar',
      'Oficina',
      'Salud y Bienestar',
      'Tecnología',
      'Textil y Vestuario'
    ];
    return orderedCats.filter(cat => cat === 'Todas' || catsInData.includes(cat));
  }, []);

  const categoryCount = useMemo(() => {
    const counts: Record<string, number> = { 'Todas': productsData.length };
    productsData.forEach(p => {
      counts[p.categoria] = (counts[p.categoria] || 0) + 1;
    });
    return counts;
  }, []);

  const filteredProducts = useMemo(() => {
    return productsData.filter(product => {
      const matchesSearch = searchTerm === '' ||
        product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.descripcion_corta.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.codigo && product.codigo.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'Todas' || product.categoria === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleProducts);
  }, [filteredProducts, visibleProducts]);

  useEffect(() => {
    setVisibleProducts(PRODUCTS_PER_PAGE);
  }, [searchTerm, selectedCategory]);

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

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setIsFilterOpen(false);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('Todas');
  };

  const hasActiveFilters = searchTerm !== '' || selectedCategory !== 'Todas';

  return (
    <div className="min-h-screen">
      <div className="sticky top-16 z-40 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 py-4 -mx-4 px-4 md:-mx-6 md:px-6 lg:-mx-8 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Buscar productos..."
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

            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="md:hidden flex items-center justify-center gap-2 px-4 py-3.5 bg-blue-900 text-white rounded-xl font-medium"
            >
              <Filter size={18} />
              Filtrar
              {selectedCategory !== 'Todas' && (
                <span className="bg-amber-500 text-xs px-2 py-0.5 rounded-full">1</span>
              )}
            </button>

            <div className="hidden md:flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategorySelect(category)}
                  className={`whitespace-nowrap px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-blue-900 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                  <span className={`ml-1.5 text-xs ${selectedCategory === category ? 'text-blue-200' : 'text-gray-500'}`}>
                    ({categoryCount[category] || 0})
                  </span>
                </button>
              ))}
            </div>
          </div>

          {isFilterOpen && (
            <div className="md:hidden mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-gray-900">Categorías</span>
                <button onClick={() => setIsFilterOpen(false)} className="p-1 hover:bg-gray-200 rounded-full">
                  <X size={18} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategorySelect(category)}
                    className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
                      selectedCategory === category
                        ? 'bg-blue-900 text-white'
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    {category}
                    <span className={`ml-1 text-xs ${selectedCategory === category ? 'text-blue-200' : 'text-gray-400'}`}>
                      ({categoryCount[category] || 0})
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2 flex-wrap">
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-full text-sm font-medium hover:bg-red-100 transition-colors"
                >
                  <X size={14} />
                  Limpiar filtros
                </button>
              )}
              {selectedCategory !== 'Todas' && (
                <span className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {selectedCategory}
                </span>
              )}
              {searchTerm && (
                <span className="px-3 py-1.5 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                  &quot;{searchTerm}&quot;
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-gray-900">{filteredProducts.length}</span> productos
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
                {searchTerm ? `No hay resultados para "${searchTerm}"` : `No hay productos en la categoría ${selectedCategory}`}
              </p>
              <button
                onClick={clearFilters}
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
