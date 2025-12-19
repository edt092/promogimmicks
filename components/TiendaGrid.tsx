'use client';

import { useState, useMemo, useEffect } from 'react';
import { Search, ShoppingCart } from 'lucide-react';
import ProductCard from './ProductCard';
import productsData from '../data/products.json';

export default function TiendaGrid() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  // Debug effect para ver cambios de estado
  useEffect(() => {
    console.log('🔍 Estado actualizado - Categoría:', selectedCategory);
  }, [selectedCategory]);

  // Obtener categorías en orden específico
  const categories = useMemo(() => {
    const orderCategories = [
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

    // Obtener categorías únicas de los productos
    const catsInData = Array.from(new Set(productsData.map(p => p.categoria)));

    // Filtrar solo las categorías que existen en los datos, manteniendo el orden
    return orderCategories.filter(cat => cat === 'Todas' || catsInData.includes(cat));
  }, []);

  // Filtrar productos
  const filteredProducts = useMemo(() => {
    console.log('🔄 Recalculando filtro - Categoría:', selectedCategory, '| Búsqueda:', searchTerm);

    const filtered = productsData.filter(product => {
      const matchesSearch = searchTerm === '' ||
                           product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.descripcion_corta.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = selectedCategory === 'Todas' || product.categoria === selectedCategory;

      const matches = matchesSearch && matchesCategory;

      return matches;
    });

    console.log('✅ Filtrado completo:', {
      totalProductos: productsData.length,
      productosFiltrados: filtered.length,
      categoríaSeleccionada: selectedCategory,
      primerosProductos: filtered.slice(0, 3).map(p => ({ nombre: p.nombre, categoria: p.categoria }))
    });

    return filtered;
  }, [searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen">
      {/* Sección de Búsqueda */}
      <div className="mb-12 md:mb-16">
        {/* Contenedor con fondo y padding */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 md:p-8">
          {/* Título de búsqueda */}
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-2">
              Encuentra tu Producto Ideal
            </h2>
            <p className="text-gray-600 text-sm md:text-base">
              Explora nuestro catálogo completo y encuentra el regalo corporativo perfecto
            </p>
          </div>

          {/* Barra de búsqueda mejorada */}
          <div className="relative max-w-full md:max-w-3xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar productos por nombre, descripción o código..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-14 py-5 text-base md:text-lg border-2 border-blue-300 rounded-2xl focus:ring-4 focus:ring-blue-400 focus:border-blue-600 transition-all duration-300 shadow-sm hover:shadow-md bg-gray-50 focus:bg-white"
              />
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-600" size={24} />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors bg-gray-200 hover:bg-blue-100 rounded-full p-1.5"
                  title="Limpiar búsqueda"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm4.2 10.8L10.8 12.2 8 9.4l-2.8 2.8-1.4-1.4L6.6 8 3.8 5.2l1.4-1.4L8 6.6l2.8-2.8 1.4 1.4L9.4 8l2.8 2.8z"/>
                  </svg>
                </button>
              )}
            </div>

            {/* Sugerencias o resultados de búsqueda */}
            {searchTerm && (
              <div className="mt-3 text-center">
                <p className="text-sm text-gray-600">
                  {filteredProducts.length > 0 ? (
                    <>
                      <span className="font-semibold text-blue-900">{filteredProducts.length}</span> producto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
                    </>
                  ) : (
                    <span className="text-amber-600">No se encontraron productos que coincidan con &quot;{searchTerm}&quot;</span>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grid de productos mejorado */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 animate-fadeIn">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 md:py-32 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 max-w-md mx-auto">
            <ShoppingCart className="mx-auto text-gray-300 mb-6" size={80} />
            <h3 className="text-2xl md:text-3xl font-bold text-gray-700 mb-3">
              No encontramos productos
            </h3>
            <p className="text-gray-500 text-base md:text-lg mb-6">
              {searchTerm
                ? `No hay resultados para "${searchTerm}"`
                : `No hay productos en la categoría ${selectedCategory}`
              }
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('Todas');
              }}
              className="bg-blue-900 hover:bg-blue-800 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Ver todos los productos
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
