'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Clock, Calendar, Tag, ArrowLeft, Share2, ChevronDown, ChevronUp, User } from 'lucide-react';
import ProductShowcase from './ProductShowcase';
import CTABanner from './CTABanner';
import BlogQuitoContent from './BlogQuitoContent';
import BlogNavidadContent from './BlogNavidadContent';
import productsData from '@/data/products.json';

interface BlogPost {
  id: string;
  slug: string;
  titulo: string;
  extracto: string;
  imagen_destacada: string;
  categoria: string;
  fecha_publicacion: string;
  tiempo_lectura: string;
  autor: string;
  tags: string[];
}

interface BlogPostContentProps {
  post: BlogPost;
}

// Seleccionar productos por categoría
const getProductsByCategory = (category: string, limit: number = 4) => {
  return productsData
    .filter(p => p.categoria.toLowerCase().includes(category.toLowerCase()))
    .slice(0, limit);
};

// Productos mixtos destacados
const getFeaturedProducts = (limit: number = 4) => {
  const categories = ['Tecnología', 'Drinkware', 'Oficina', 'Accesorios'];
  const featured: typeof productsData = [];

  categories.forEach(cat => {
    const product = productsData.find(p => p.categoria === cat);
    if (product) featured.push(product);
  });

  return featured.slice(0, limit);
};

// Componente para renderizar contenido específico por slug
function BlogContentBySlug({ slug }: { slug: string }) {
  if (slug === 'productos-promocionales-baratos-quito-2025') {
    return <BlogQuitoContent />;
  }
  if (slug === 'guia-articulos-promocionales-navidenos-2025') {
    return <BlogNavidadContent />;
  }
  // El contenido por defecto se renderiza en el componente principal
  return null;
}

export default function BlogPostContent({ post }: BlogPostContentProps) {
  const [imageError, setImageError] = useState(false);
  const [tocOpen, setTocOpen] = useState(true);

  // Verificar si este post tiene contenido específico
  const hasCustomContent = post.slug === 'productos-promocionales-baratos-quito-2025' || post.slug === 'guia-articulos-promocionales-navidenos-2025';

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.titulo,
          text: post.extracto,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Enlace copiado al portapapeles');
    }
  };

  // Productos para las diferentes secciones
  const techProducts = getProductsByCategory('Tecnología', 4);
  const officeProducts = getProductsByCategory('Oficina', 4);
  const drinkwareProducts = getProductsByCategory('Drinkware', 3);
  const accessoryProducts = getProductsByCategory('Accesorios', 4);
  const featuredProducts = getFeaturedProducts(4);

  return (
    <article className="pt-20">
      {/* Hero Header */}
      <header className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 overflow-hidden">
        {/* Decoración de fondo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          {/* Breadcrumb */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-blue-200 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft size={18} />
            <span>Volver al Blog</span>
          </Link>

          {/* Categoría y metadata */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="inline-flex items-center gap-1 bg-amber-500 text-white text-sm font-bold px-4 py-1.5 rounded-full">
              <Tag size={14} />
              {post.categoria}
            </span>
            <div className="flex items-center gap-4 text-blue-200 text-sm">
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                {formatDate(post.fecha_publicacion)}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {post.tiempo_lectura}
              </span>
            </div>
          </div>

          {/* Título */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
            {post.titulo}
          </h1>

          {/* Extracto */}
          <p className="text-lg md:text-xl text-blue-100 leading-relaxed mb-8">
            {post.extracto}
          </p>

          {/* Autor y Share */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center">
                <User size={24} className="text-white" />
              </div>
              <div>
                <p className="text-white font-semibold">{post.autor}</p>
                <p className="text-blue-200 text-sm">Expertos en Productos Promocionales</p>
              </div>
            </div>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg transition-colors border border-white/20"
            >
              <Share2 size={18} />
              <span className="hidden sm:inline">Compartir</span>
            </button>
          </div>
        </div>

        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 0L60 5C120 10 240 20 360 25C480 30 600 30 720 27.5C840 25 960 20 1080 17.5C1200 15 1320 17.5 1380 18.75L1440 20V60H1380C1320 60 1200 60 1080 60C960 60 840 60 720 60C600 60 480 60 360 60C240 60 120 60 60 60H0V0Z" fill="rgb(249, 250, 251)"/>
          </svg>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Renderizar contenido específico si existe */}
        {hasCustomContent ? (
          <BlogContentBySlug slug={post.slug} />
        ) : (
          <>
        {/* Table of Contents - Collapsible */}
        <div className="mb-10 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <button
            onClick={() => setTocOpen(!tocOpen)}
            className="w-full flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-white hover:from-blue-100 transition-colors"
          >
            <h2 className="text-xl font-bold text-blue-900">Tabla de Contenidos</h2>
            {tocOpen ? <ChevronUp size={24} className="text-blue-600" /> : <ChevronDown size={24} className="text-blue-600" />}
          </button>

          {tocOpen && (
            <nav className="p-6 pt-0">
              <ol className="space-y-2 text-gray-700">
                <li><a href="#intro" className="hover:text-amber-600 transition-colors flex items-center gap-2"><span className="w-6 h-6 bg-blue-100 text-blue-900 rounded-full text-xs flex items-center justify-center font-bold">1</span> Introducción</a></li>
                <li><a href="#comprendiendo-necesidades" className="hover:text-amber-600 transition-colors flex items-center gap-2"><span className="w-6 h-6 bg-blue-100 text-blue-900 rounded-full text-xs flex items-center justify-center font-bold">2</span> Comprendiendo tus Necesidades</a></li>
                <li><a href="#proveedores-locales-vs-online" className="hover:text-amber-600 transition-colors flex items-center gap-2"><span className="w-6 h-6 bg-blue-100 text-blue-900 rounded-full text-xs flex items-center justify-center font-bold">3</span> Proveedores Locales vs. Online</a></li>
                <li><a href="#gigantes-sector" className="hover:text-amber-600 transition-colors flex items-center gap-2"><span className="w-6 h-6 bg-blue-100 text-blue-900 rounded-full text-xs flex items-center justify-center font-bold">4</span> Gigantes del Sector</a></li>
                <li><a href="#marketplaces" className="hover:text-amber-600 transition-colors flex items-center gap-2"><span className="w-6 h-6 bg-blue-100 text-blue-900 rounded-full text-xs flex items-center justify-center font-bold">5</span> Plataformas de Marketplace</a></li>
                <li><a href="#fabricantes-directos" className="hover:text-amber-600 transition-colors flex items-center gap-2"><span className="w-6 h-6 bg-blue-100 text-blue-900 rounded-full text-xs flex items-center justify-center font-bold">6</span> Fabricantes Directos</a></li>
                <li><a href="#productos-ecologicos" className="hover:text-amber-600 transition-colors flex items-center gap-2"><span className="w-6 h-6 bg-blue-100 text-blue-900 rounded-full text-xs flex items-center justify-center font-bold">7</span> Productos Ecológicos</a></li>
                <li><a href="#presupuesto" className="hover:text-amber-600 transition-colors flex items-center gap-2"><span className="w-6 h-6 bg-blue-100 text-blue-900 rounded-full text-xs flex items-center justify-center font-bold">8</span> Presupuesto y Precios</a></li>
                <li><a href="#personalizacion" className="hover:text-amber-600 transition-colors flex items-center gap-2"><span className="w-6 h-6 bg-blue-100 text-blue-900 rounded-full text-xs flex items-center justify-center font-bold">9</span> Personalización y Diseño</a></li>
                <li><a href="#impuestos-envio" className="hover:text-amber-600 transition-colors flex items-center gap-2"><span className="w-6 h-6 bg-blue-100 text-blue-900 rounded-full text-xs flex items-center justify-center font-bold">10</span> Impuestos y Envío</a></li>
                <li><a href="#control-calidad" className="hover:text-amber-600 transition-colors flex items-center gap-2"><span className="w-6 h-6 bg-blue-100 text-blue-900 rounded-full text-xs flex items-center justify-center font-bold">11</span> Control de Calidad</a></li>
                <li><a href="#faq" className="hover:text-amber-600 transition-colors flex items-center gap-2"><span className="w-6 h-6 bg-blue-100 text-blue-900 rounded-full text-xs flex items-center justify-center font-bold">12</span> Preguntas Frecuentes</a></li>
                <li><a href="#conclusion" className="hover:text-amber-600 transition-colors flex items-center gap-2"><span className="w-6 h-6 bg-blue-100 text-blue-900 rounded-full text-xs flex items-center justify-center font-bold">13</span> Conclusión</a></li>
              </ol>
            </nav>
          )}
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none prose-headings:text-blue-900 prose-a:text-amber-600 prose-a:no-underline hover:prose-a:underline">

          {/* Introducción */}
          <section id="intro" className="scroll-mt-24">
            <p className="text-lg text-gray-700 leading-relaxed">
              ¿Cansado de que tu marca pase desapercibida? Encontrar los productos promocionales perfectos para impulsar tu negocio puede ser un laberinto. Pero no te preocupes, esta guía definitiva te revelará los secretos para elegir al proveedor ideal. Descubre dónde comprar productos promocionales de forma inteligente, optimizando tu presupuesto y maximizando el impacto de tu marca. Desde entender tus necesidades específicas hasta analizar a los gigantes del sector, te daremos las claves para una estrategia promocional exitosa. Prepárate para destacar y conquistar a tus clientes.
            </p>
          </section>

          {/* PRODUCTOS DESTACADOS - PRIMERA INSERCIÓN */}
          <ProductShowcase
            products={featuredProducts}
            title="Productos Más Populares en Ecuador"
            subtitle="Los favoritos de nuestros clientes para campañas exitosas"
            variant="featured"
          />

          {/* Sección 1: Comprendiendo tus Necesidades */}
          <section id="comprendiendo-necesidades" className="scroll-mt-24">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mt-12 mb-6">
              1. Comprendiendo tus Necesidades: ¿Qué Productos Promocionales Necesitas Realmente?
            </h2>

            <p>
              Antes de lanzarte a buscar proveedores, es fundamental que te hagas algunas preguntas clave. ¿Cuál es el objetivo de tu campaña promocional? ¿A quién va dirigida? ¿Qué presupuesto tienes disponible? Responder a estas preguntas te ayudará a definir el tipo de producto que necesitas.
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-6 rounded-r-lg">
              <h4 className="font-bold text-blue-900 mb-3">Preguntas clave antes de comprar:</h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span><strong>Objetivo:</strong> ¿Quieres aumentar el reconocimiento de marca, fidelizar clientes o generar leads?</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span><strong>Audiencia:</strong> ¿A quién van dirigidos los productos? ¿Clientes, empleados, socios comerciales?</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span><strong>Presupuesto:</strong> ¿Cuánto estás dispuesto a invertir por unidad y en total?</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span><strong>Cantidad:</strong> ¿Cuántas unidades necesitas?</span>
                </li>
              </ul>
            </div>
          </section>

          {/* CTA Inline */}
          <CTABanner
            variant="inline"
            title="¿Ya sabes qué productos necesitas?"
            subtitle="Explora nuestro catálogo con más de 199 opciones"
          />

          {/* Sección 2: Proveedores Locales vs Online */}
          <section id="proveedores-locales-vs-online" className="scroll-mt-24">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mt-12 mb-6">
              2. Proveedores Locales vs. Online: ¿Cuál es la Mejor Opción para tu Negocio?
            </h2>

            <p>
              La elección entre proveedores locales y tiendas online depende de varios factores. Los proveedores locales ofrecen la ventaja de una comunicación más directa, la posibilidad de ver y tocar los productos antes de comprar, y tiempos de entrega más cortos. Sin embargo, las tiendas online suelen tener un catálogo más amplio y precios más competitivos.
            </p>

            <div className="grid md:grid-cols-2 gap-6 my-8">
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                <h4 className="font-bold text-blue-900 mb-4 text-lg">Proveedores Locales</h4>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> Comunicación directa y personalizada
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> Ver productos antes de comprar
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> Tiempos de entrega más cortos
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> Soporte post-venta cercano
                  </li>
                </ul>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                <h4 className="font-bold text-blue-900 mb-4 text-lg">Proveedores Online</h4>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> Catálogo más amplio
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> Precios competitivos
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> Comparación fácil de productos
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> Disponibilidad 24/7
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* PRODUCTOS DE TECNOLOGÍA */}
          <ProductShowcase
            products={techProducts}
            title="Productos Tecnológicos Promocionales"
            subtitle="Los artículos tech más cotizados para empresas modernas"
            variant="default"
          />

          {/* Sección 3: Gigantes del Sector */}
          <section id="gigantes-sector" className="scroll-mt-24">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mt-12 mb-6">
              3. Explorando los Gigantes del Sector: Análisis de los Principales Proveedores
            </h2>

            <p>
              El mercado de productos promocionales cuenta con varios proveedores consolidados que ofrecen una amplia gama de productos y servicios. Es importante investigar y comparar las ofertas de diferentes proveedores para encontrar el que mejor se adapte a tus necesidades.
            </p>

            <p>
              <strong>PromoGimmicks</strong> se destaca como uno de los proveedores líderes en Ecuador, ofreciendo más de 199 productos promocionales personalizables, desde artículos de escritura hasta tecnología, con entrega en todo el país.
            </p>
          </section>

          {/* Sección 4: Marketplaces */}
          <section id="marketplaces" className="scroll-mt-24">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mt-12 mb-6">
              4. Plataformas de Marketplace: Ventajas y Desventajas
            </h2>

            <h3 className="text-xl font-bold text-blue-800 mt-8 mb-4">La Amplia Selección y Facilidad de Uso</h3>

            <p>
              Una de las principales ventajas de comprar productos promocionales en marketplaces es la extensa selección disponible. Puedes encontrar desde bolígrafos y llaveros hasta camisetas y tazas, todo en un solo lugar. Además, la interfaz intuitiva y los sistemas de búsqueda facilitan la comparación de precios y la identificación de productos que se ajusten a tus necesidades.
            </p>

            <div className="bg-amber-50 border-l-4 border-amber-500 p-6 my-6 rounded-r-lg">
              <p className="text-amber-900 font-medium">
                <strong>Consejo Pro:</strong> Antes de comprar en un marketplace, verifica siempre las reseñas del vendedor, las políticas de devolución y los tiempos de entrega estimados.
              </p>
            </div>
          </section>

          {/* PRODUCTOS DE OFICINA */}
          <ProductShowcase
            products={officeProducts}
            title="Artículos de Oficina Personalizables"
            subtitle="Perfectos para regalos ejecutivos y corporativos"
            variant="compact"
          />

          {/* Sección 5: Fabricantes Directos */}
          <section id="fabricantes-directos" className="scroll-mt-24">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mt-12 mb-6">
              5. Fabricantes Directos: ¿Cuándo Considerar la Compra Directa?
            </h2>

            <h3 className="text-xl font-bold text-blue-800 mt-8 mb-4">¿Cómo Encontrar Fabricantes Directos Confiables?</h3>

            <p>
              La búsqueda de fabricantes directos puede comenzar con <strong>ferias comerciales</strong> especializadas en productos promocionales. Estos eventos son una excelente oportunidad para conocer fabricantes, ver sus productos en persona y establecer contactos.
            </p>

            <p>
              También puedes buscar fabricantes locales a través de directorios industriales o asociaciones empresariales. Antes de comprometerte con un fabricante, solicita muestras y realiza una prueba de calidad para asegurarte de que cumplen con tus estándares.
            </p>

            <h3 className="text-xl font-bold text-blue-800 mt-8 mb-4">Consideraciones Clave al Tratar Directamente con Fabricantes</h3>

            <p>
              Establecer una comunicación clara y detallada es fundamental. Define claramente tus especificaciones, cantidades, plazos de entrega y estándares de calidad. Solicita un contrato formal que proteja tus intereses y establezca las responsabilidades de ambas partes.
            </p>
          </section>

          {/* CTA WhatsApp */}
          <CTABanner
            variant="whatsapp"
            title="¿Necesitas asesoría para tu pedido?"
            subtitle="Te ayudamos a elegir los mejores productos para tu marca"
          />

          {/* Sección 6: Productos Ecológicos */}
          <section id="productos-ecologicos" className="scroll-mt-24">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mt-12 mb-6">
              6. Productos Promocionales Ecológicos y Sostenibles
            </h2>

            <p>
              Los <strong>productos promocionales ecológicos</strong> son una excelente manera de alinear tu marca con valores de sostenibilidad y atraer a un público cada vez más consciente del medio ambiente. Elegir opciones responsables no solo reduce el impacto ambiental, sino que también mejora la imagen de tu empresa.
            </p>

            <h3 className="text-xl font-bold text-blue-800 mt-8 mb-4">Proveedores Especializados en Productos Sostenibles</h3>

            <p>
              Existen proveedores que se dedican exclusivamente a ofrecer artículos promocionales ecológicos. Estos proveedores suelen tener un catálogo extenso que incluye desde bolígrafos de bambú hasta bolsas de algodón orgánico y botellas reutilizables hechas de materiales reciclados.
            </p>

            <h3 className="text-xl font-bold text-blue-800 mt-8 mb-4">Consideraciones Clave al Elegir Productos Ecológicos</h3>

            <p>
              No basta con que un producto se anuncie como &quot;ecológico&quot;. Es fundamental verificar su ciclo de vida completo: ¿De dónde provienen los materiales? ¿Cómo se fabricó el producto? ¿Qué impacto tiene su uso y desecho?
            </p>
          </section>

          {/* PRODUCTOS DRINKWARE */}
          <ProductShowcase
            products={drinkwareProducts}
            title="Botellas y Termos Personalizables"
            subtitle="Productos eco-friendly que tus clientes usarán a diario"
            variant="compact"
          />

          {/* Sección 7: Presupuesto y Precios */}
          <section id="presupuesto" className="scroll-mt-24">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mt-12 mb-6">
              7. Presupuesto y Precios: Cómo Obtener el Mejor Valor
            </h2>

            <p>
              El presupuesto es un factor crucial en la selección de productos promocionales. Determinar un presupuesto realista y comprender cómo se estructura el precio te permitirá maximizar el retorno de tu inversión y obtener el mejor valor por tu dinero.
            </p>

            <h3 className="text-xl font-bold text-blue-800 mt-8 mb-4">Desglose de Costos y Márgenes</h3>

            <p>
              Entender cómo se compone el precio final de los artículos promocionales es esencial para negociar y tomar decisiones informadas:
            </p>

            <ul className="list-disc pl-6 space-y-2 my-4">
              <li><strong>Costo del producto base:</strong> Varía según el material, la calidad y el volumen de compra.</li>
              <li><strong>Costo de personalización:</strong> Depende de la técnica utilizada, el número de colores y la complejidad del diseño.</li>
              <li><strong>Costos de envío:</strong> Pueden ser significativos, especialmente para pedidos grandes.</li>
              <li><strong>Márgenes del proveedor:</strong> Es importante comparar precios entre diferentes proveedores.</li>
            </ul>

            <h3 className="text-xl font-bold text-blue-800 mt-8 mb-4">Estrategias para Optimizar el Presupuesto</h3>

            <div className="bg-green-50 border-l-4 border-green-500 p-6 my-6 rounded-r-lg">
              <h4 className="font-bold text-green-900 mb-3">Tips para ahorrar:</h4>
              <ul className="space-y-2 text-green-800">
                <li>✓ Planifica con anticipación y evita pedidos de última hora</li>
                <li>✓ Compra al por mayor para obtener mejores precios unitarios</li>
                <li>✓ Simplifica el diseño para reducir costos de impresión</li>
                <li>✓ Negocia con proveedores, especialmente si eres cliente recurrente</li>
                <li>✓ Solicita una muestra virtual antes de confirmar el pedido</li>
              </ul>
            </div>
          </section>

          {/* CTA Secondary */}
          <CTABanner
            variant="secondary"
            title="Productos para Cada Presupuesto"
            subtitle="Desde opciones económicas hasta artículos premium. Encuentra el equilibrio perfecto entre calidad y precio."
          />

          {/* Sección 8: Personalización y Diseño */}
          <section id="personalizacion" className="scroll-mt-24">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mt-12 mb-6">
              8. Personalización y Diseño: Consejos para Crear Productos Impactantes
            </h2>

            <p>
              Crear productos promocionales impactantes va más allá de simplemente estampar un logo. Requiere una estrategia de diseño bien pensada que refleje la identidad de tu marca y resuene con tu público objetivo.
            </p>

            <h3 className="text-xl font-bold text-blue-800 mt-8 mb-4">Conoce a tu Audiencia y Define tu Mensaje</h3>

            <p>
              Antes de siquiera pensar en colores o tipografías, es crucial entender a quién te diriges. ¿Cuáles son sus intereses? ¿Qué tipo de productos valoran?
            </p>

            <h3 className="text-xl font-bold text-blue-800 mt-8 mb-4">Elementos Clave de un Diseño Atractivo</h3>

            <ul className="list-disc pl-6 space-y-2 my-4">
              <li><strong>Tipografía:</strong> Elige fuentes legibles que reflejen la personalidad de tu marca.</li>
              <li><strong>Color:</strong> Utiliza colores atractivos en consonancia con tu identidad visual.</li>
              <li><strong>Imágenes:</strong> Usa imágenes de alta calidad relevantes para tu mensaje.</li>
              <li><strong>Llamada a la acción:</strong> Incluye una CTA clara y concisa.</li>
            </ul>
          </section>

          {/* PRODUCTOS ACCESORIOS */}
          <ProductShowcase
            products={accessoryProducts}
            title="Accesorios Promocionales Versátiles"
            subtitle="Opciones prácticas que tu audiencia usará constantemente"
            variant="default"
          />

          {/* Sección 9: Impuestos y Envío */}
          <section id="impuestos-envio" className="scroll-mt-24">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mt-12 mb-6">
              9. Impuestos, Aduanas y Envío: Aspectos Legales y Logísticos
            </h2>

            <p>
              Al planificar la compra de productos promocionales, es crucial considerar los aspectos legales y logísticos relacionados con impuestos, aduanas y envío, especialmente si se adquieren fuera del país.
            </p>

            <h3 className="text-xl font-bold text-blue-800 mt-8 mb-4">Impuestos y Aranceles: Conociendo el Costo Real</h3>

            <ul className="list-disc pl-6 space-y-2 my-4">
              <li><strong>IVA:</strong> La mayoría de los países aplican un IVA a las importaciones.</li>
              <li><strong>Aranceles Aduaneros:</strong> Varían según la clasificación arancelaria del producto.</li>
              <li><strong>Calculadora de Impuestos:</strong> Utiliza herramientas online para estimar costos totales.</li>
            </ul>

            <h3 className="text-xl font-bold text-blue-800 mt-8 mb-4">Envío y Logística: Eligiendo la Opción Correcta</h3>

            <p>
              La elección del método de envío adecuado es crucial para garantizar una entrega rápida y segura. Considera factores como el tiempo de entrega, el costo y la confiabilidad del transportista.
            </p>
          </section>

          {/* Sección 10: Control de Calidad */}
          <section id="control-calidad" className="scroll-mt-24">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mt-12 mb-6">
              10. Control de Calidad: Asegurando que tus Productos Cumplan tus Expectativas
            </h2>

            <p>
              Asegurar que tus productos promocionales reflejen la calidad de tu marca es crucial. No basta con encontrar un buen precio; la durabilidad, el diseño y la funcionalidad son igualmente importantes.
            </p>

            <h3 className="text-xl font-bold text-blue-800 mt-8 mb-4">Inspección en Diferentes Etapas de Producción</h3>

            <ul className="list-disc pl-6 space-y-2 my-4">
              <li><strong>Inspección de Materias Primas:</strong> Verificar la calidad de los materiales antes de iniciar la producción.</li>
              <li><strong>Inspección Durante la Producción (DPI):</strong> Monitorear el proceso para identificar defectos.</li>
              <li><strong>Inspección Pre-Embarque (PSI):</strong> Una inspección final antes del envío.</li>
            </ul>
          </section>

          {/* Sección 11: FAQ */}
          <section id="faq" className="scroll-mt-24">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mt-12 mb-6">
              11. Preguntas Frecuentes sobre Productos Promocionales
            </h2>

            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                <h4 className="font-bold text-blue-900 mb-3">¿Cuál es la Cantidad Mínima de Pedido (MOQ)?</h4>
                <p className="text-gray-700">
                  La cantidad mínima de pedido varía según el proveedor y el tipo de producto. Algunos proveedores se especializan en pedidos pequeños, mientras que otros requieren cantidades mayores. Es importante investigar y comparar las opciones disponibles.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                <h4 className="font-bold text-blue-900 mb-3">¿Qué Formatos de Archivo Necesito para el Logotipo?</h4>
                <p className="text-gray-700">
                  Para una impresión de alta calidad, se prefieren archivos vectoriales como AI (Adobe Illustrator), EPS o PDF. Evita formatos rasterizados como JPG o PNG que pueden verse pixelados al ampliarlos.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                <h4 className="font-bold text-blue-900 mb-3">¿Cómo Calcular el ROI en Productos Promocionales?</h4>
                <p className="text-gray-700">
                  Define objetivos claros antes de la campaña, rastrea las ventas generadas, realiza encuestas y utiliza códigos de descuento únicos para medir el impacto de tus productos promocionales.
                </p>
              </div>
            </div>
          </section>

          {/* CTA Principal */}
          <CTABanner
            variant="primary"
            title="¿Listo para Impulsar tu Marca?"
            subtitle="Descubre nuestra colección completa de productos promocionales. Personalización garantizada, entrega en todo Ecuador."
          />

          {/* Conclusión */}
          <section id="conclusion" className="scroll-mt-24">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mt-12 mb-6">
              Conclusión
            </h2>

            <p>
              La elección del proveedor ideal de productos promocionales es una decisión estratégica que impacta directamente la visibilidad y el reconocimiento de tu marca. Hemos analizado desde la importancia de definir tus necesidades específicas hasta las ventajas y desventajas de optar por proveedores locales, gigantes del sector o marketplaces online.
            </p>

            <p>
              La clave reside en equilibrar la calidad, el precio, la personalización y la rapidez de entrega para encontrar la opción que mejor se ajuste a tu presupuesto y objetivos de marketing.
            </p>

            <p>
              Más allá de la simple compra, la adquisición de productos promocionales es una inversión en la construcción de una imagen de marca sólida y memorable. Un producto bien elegido, con un diseño atractivo y un mensaje claro, puede convertirse en un embajador silencioso de tu negocio.
            </p>

            <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-2xl p-8 my-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-4">
                ¡Es hora de pasar a la acción!
              </h3>
              <p className="text-blue-100 mb-6">
                Contacta hoy mismo y solicita un presupuesto personalizado para tu empresa.
              </p>
              <Link
                href="/tienda"
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300"
              >
                Explorar Catálogo Completo
              </Link>
            </div>
          </section>

        </div>
          </>
        )}

        {/* Tags */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h4 className="font-semibold text-gray-700 mb-4">Etiquetas:</h4>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm hover:bg-blue-100 transition-colors cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Navegación */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-blue-900 hover:text-amber-600 font-semibold transition-colors"
          >
            <ArrowLeft size={18} />
            Volver al Blog
          </Link>
        </div>
      </div>
    </article>
  );
}
