"""
Script para actualizar los componentes de la tienda
"""

import os

# TiendaGrid.tsx content
tienda_grid_content = '''\'use client\';

import { useState, useMemo, useEffect, useCallback, useRef } from \'react\';
import { Search, Filter, X, ShoppingCart } from \'lucide-react\';
import ProductCard from \'./ProductCard\';
import productsData from \'../data/products.json\';

const PRODUCTS_PER_PAGE = 20;

export default function TiendaGrid() {
  const [searchTerm, setSearchTerm] = useState(\'\');
  const [selectedCategory, setSelectedCategory] = useState(\'Todas\');
  const [visibleProducts, setVisibleProducts] = useState(PRODUCTS_PER_PAGE);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  const categories = useMemo(() => {
    const catsInData = Array.from(new Set(productsData.map(p => p.categoria)));
    const orderedCats = [
      \'Todas\',
      \'Accesorios\',
      \'Artículos de Escritura\',
      \'Bolsos y Mochilas\',
      \'Deportes y Recreación\',
      \'Drinkware\',
      \'Eco\',
      \'Hogar\',
      \'Oficina\',
      \'Salud y Bienestar\',
      \'Tecnología\',
      \'Textil y Vestuario\'
    ];
    return orderedCats.filter(cat => cat === \'Todas\' || catsInData.includes(cat));
  }, []);

  const categoryCount = useMemo(() => {
    const counts: Record<string, number> = { \'Todas\': productsData.length };
    productsData.forEach(p => {
      counts[p.categoria] = (counts[p.categoria] || 0) + 1;
    });
    return counts;
  }, []);

  const filteredProducts = useMemo(() => {
    return productsData.filter(product => {
      const matchesSearch = searchTerm === \'\' ||
        product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.descripcion_corta.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.codigo && product.codigo.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === \'Todas\' || product.categoria === selectedCategory;
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
      { threshold: 0.1, rootMargin: \'100px\' }
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
    setSearchTerm(\'\');
    setSelectedCategory(\'Todas\');
  };

  const hasActiveFilters = searchTerm !== \'\' || selectedCategory !== \'Todas\';

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
                  onClick={() => setSearchTerm(\'\')}
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
              {selectedCategory !== \'Todas\' && (
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
                      ? \'bg-blue-900 text-white shadow-md\'
                      : \'bg-gray-100 text-gray-700 hover:bg-gray-200\'
                  }`}
                >
                  {category}
                  <span className={`ml-1.5 text-xs ${selectedCategory === category ? \'text-blue-200\' : \'text-gray-500\'}`}>
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
                        ? \'bg-blue-900 text-white\'
                        : \'bg-white text-gray-700 border border-gray-200 hover:border-blue-300\'
                    }`}
                  >
                    {category}
                    <span className={`ml-1 text-xs ${selectedCategory === category ? \'text-blue-200\' : \'text-gray-400\'}`}>
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
              {selectedCategory !== \'Todas\' && (
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
'''

# ProductCard.tsx content
product_card_content = '''\'use client\';

import { useState, useRef, useEffect } from \'react\';
import { ShoppingCart, Tag, Eye } from \'lucide-react\';
import Link from \'next/link\';

interface Product {
  id: string;
  nombre: string;
  slug: string;
  categoria: string;
  descripcion_corta: string;
  imagen_url: string;
  codigo?: string;
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
      { rootMargin: \'200px\', threshold: 0.01 }
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
    const whatsappUrl = `https://wa.me/593999999999?text=${encodeURIComponent(mensaje)}`;
    window.open(whatsappUrl, \'_blank\');
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
              isLoaded ? \'opacity-100\' : \'opacity-0\'
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
'''

# ProductDetailView.tsx content
product_detail_content = '''\'use client\';

import { useState, useEffect } from \'react\';
import { ShoppingCart, ArrowLeft, Tag, Share2, Check, MessageCircle, Truck, Award, Shield } from \'lucide-react\';
import Link from \'next/link\';
import productsData from \'../data/products.json\';

interface Product {
  id: string;
  nombre: string;
  slug: string;
  categoria: string;
  categoria_slug: string;
  descripcion_corta: string;
  imagen_url: string;
  codigo?: string;
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
    const mensaje = `Hola! Me interesa cotizar el producto: ${product.nombre}\\n\\nCategoría: ${product.categoria}${product.codigo ? `\\nCódigo: ${product.codigo}` : \'\'}\\n\\n¿Podrían enviarme información sobre precios, cantidades mínimas y opciones de personalización?`;
    const whatsappUrl = `https://wa.me/593999999999?text=${encodeURIComponent(mensaje)}`;
    window.open(whatsappUrl, \'_blank\');
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
                className={`max-w-full max-h-full object-contain transition-opacity duration-300 ${imageLoaded ? \'opacity-100\' : \'opacity-0\'}`}
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
                \'Impresión de logo en alta calidad\',
                \'Múltiples técnicas de marcado disponibles\',
                \'Asesoría de diseño incluida\',
                \'Entrega en todo Ecuador\'
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
              {copied ? \'¡Enlace copiado!\' : \'Compartir Producto\'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200">
            {[
              { icon: Award, title: \'Calidad Premium\', desc: \'Materiales de primera\' },
              { icon: Truck, title: \'Envío Nacional\', desc: \'A todo Ecuador\' },
              { icon: Shield, title: \'Garantía\', desc: \'Satisfacción total\' },
              { icon: MessageCircle, title: \'Soporte\', desc: \'Asesoría personalizada\' }
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
'''

# Write files
base_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

with open(os.path.join(base_path, 'components', 'TiendaGrid.tsx'), 'w', encoding='utf-8') as f:
    f.write(tienda_grid_content)
print("[OK] TiendaGrid.tsx actualizado")

with open(os.path.join(base_path, 'components', 'ProductCard.tsx'), 'w', encoding='utf-8') as f:
    f.write(product_card_content)
print("[OK] ProductCard.tsx actualizado")

with open(os.path.join(base_path, 'components', 'ProductDetailView.tsx'), 'w', encoding='utf-8') as f:
    f.write(product_detail_content)
print("[OK] ProductDetailView.tsx actualizado")

print("\n¡Componentes actualizados exitosamente!")
print("Ejecuta 'npm run build' para verificar.")
