import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import productsData from '@/data/products.json';

const SITE_URL = 'https://promogimmicks.com';

// Descripciones SEO únicas para cada categoría
const categoryDescriptions: Record<string, {
  title: string;
  description: string;
  content: string;
  keywords: string;
}> = {
  'accesorios': {
    title: 'Accesorios Promocionales Personalizados',
    description: 'Descubre nuestra colección de accesorios promocionales personalizables con tu logo. Llaveros, paraguas, cosmetiqueras y más. Envíos a Ecuador y Colombia.',
    content: 'Los accesorios promocionales son herramientas de marketing versátiles que generan visibilidad de marca en la vida diaria de tus clientes. Desde llaveros hasta paraguas personalizados, cada artículo es una oportunidad para que tu logo viaje con tus clientes a todas partes. Ideales para eventos corporativos, ferias empresariales y campañas de fidelización en Quito, Guayaquil, Bogotá y Medellín.',
    keywords: 'accesorios promocionales, accesorios personalizados, llaveros corporativos, paraguas con logo, regalos empresariales ecuador, merchandising colombia'
  },
  'oficina': {
    title: 'Artículos de Oficina Promocionales',
    description: 'Artículos de oficina promocionales para empresas. Organizadores, porta-lápices, sets de escritorio personalizados. Regalos ejecutivos en Ecuador y Colombia.',
    content: 'Eleva la imagen de tu empresa con artículos de oficina promocionales de alta calidad. Desde elegantes organizadores de escritorio hasta sets ejecutivos completos, cada pieza refleja profesionalismo y atención al detalle. Perfectos para regalos a clientes VIP, kits de bienvenida para empleados y eventos corporativos en Ecuador y Colombia.',
    keywords: 'artículos de oficina promocionales, sets de escritorio personalizados, regalos ejecutivos, organizadores corporativos, merchandising oficina ecuador'
  },
  'drinkware': {
    title: 'Drinkware y Termos Promocionales',
    description: 'Termos, botellas y mugs personalizados con tu marca. Drinkware promocional de alta calidad. Envíos a Ecuador y Colombia.',
    content: 'El drinkware promocional es uno de los artículos publicitarios más efectivos por su uso diario y alta visibilidad. Ofrecemos termos vacuum, botellas deportivas, mugs de viaje y vasos personalizables con tu logo. Cada producto mantiene tus bebidas a la temperatura ideal mientras promociona tu marca en oficinas, gimnasios y espacios públicos de Quito, Guayaquil, Bogotá y Medellín.',
    keywords: 'termos personalizados, botellas promocionales, mugs con logo, drinkware corporativo, vasos publicitarios ecuador, termos colombia'
  },
  'hogar': {
    title: 'Artículos para el Hogar Promocionales',
    description: 'Productos promocionales para el hogar. Sets de cocina, herramientas, artículos de baño personalizados. Regalo corporativo útil en Ecuador y Colombia.',
    content: 'Los artículos para el hogar promocionales garantizan presencia de marca en los espacios más íntimos de tus clientes. Desde sets de cocina hasta herramientas de uso diario, estos productos combinan utilidad con visibilidad de marca. Ideales para campañas de fidelización y regalos que generan impacto duradero en hogares de Ecuador y Colombia.',
    keywords: 'artículos hogar promocionales, sets de cocina personalizados, herramientas con logo, regalos útiles corporativos, productos hogar ecuador'
  },
  'tecnologia': {
    title: 'Productos Tecnológicos Promocionales',
    description: 'Accesorios tecnológicos promocionales. Audífonos bluetooth, cables, speakers y gadgets personalizados. Regalos corporativos tech en Ecuador y Colombia.',
    content: 'Los productos tecnológicos promocionales posicionan tu marca como innovadora y moderna. Ofrecemos audífonos bluetooth, cables de carga, speakers, power banks y más, todos personalizables con tu logo. Perfectos para empresas de tecnología, startups y cualquier organización que quiera proyectar una imagen vanguardista en Ecuador y Colombia.',
    keywords: 'accesorios tecnológicos promocionales, audífonos bluetooth personalizados, gadgets corporativos, regalos tech empresariales, tecnología promocional ecuador'
  },
  'articulos-de-escritura': {
    title: 'Artículos de Escritura Promocionales',
    description: 'Bolígrafos, sets de escritura y rollers promocionales personalizados. Artículos de escritura con logo para empresas en Ecuador y Colombia.',
    content: 'Los artículos de escritura son clásicos del marketing promocional que nunca pasan de moda. Desde bolígrafos económicos para eventos masivos hasta elegantes sets de escritura ejecutivos, tenemos opciones para cada presupuesto y ocasión. Alta rotación garantiza que tu logo sea visto miles de veces en oficinas, reuniones y eventos de Quito, Guayaquil, Bogotá y Medellín.',
    keywords: 'bolígrafos promocionales, sets de escritura personalizados, rollers corporativos, artículos de escritura con logo, bolígrafos ecuador colombia'
  },
  'eco': {
    title: 'Productos Ecológicos Promocionales',
    description: 'Productos promocionales ecológicos y sustentables. Artículos de bambú, materiales reciclados y opciones eco-friendly. Marketing verde en Ecuador y Colombia.',
    content: 'Demuestra el compromiso de tu empresa con el medio ambiente con nuestra línea de productos ecológicos promocionales. Artículos fabricados con bambú, materiales reciclados y opciones biodegradables que comunican valores de sustentabilidad. Perfectos para empresas con responsabilidad ambiental que buscan merchandising verde en Ecuador y Colombia.',
    keywords: 'productos ecológicos promocionales, merchandising sustentable, artículos de bambú personalizados, regalos eco-friendly, marketing verde ecuador'
  },
  'bolsos-y-mochilas': {
    title: 'Bolsos y Mochilas Promocionales',
    description: 'Mochilas, bolsos y carry-ons personalizados con tu logo. Artículos de viaje promocionales de alta calidad. Envíos a Ecuador y Colombia.',
    content: 'Los bolsos y mochilas promocionales ofrecen la mayor área de impresión para tu logo, garantizando visibilidad en espacios públicos, transporte y oficinas. Desde mochilas deportivas hasta carry-ons ejecutivos, cada producto combina funcionalidad con exposición de marca. Ideales para equipos de ventas, eventos y regalos corporativos de alto impacto en Ecuador y Colombia.',
    keywords: 'mochilas promocionales, bolsos personalizados, carry-on corporativo, maletas con logo, artículos de viaje promocionales ecuador'
  },
  'textil-y-vestuario': {
    title: 'Uniformes y Vestuario Corporativo',
    description: 'Uniformes, camisetas y gorras promocionales personalizadas. Textil corporativo de calidad. Vestimenta con logo para empresas en Ecuador y Colombia.',
    content: 'El vestuario corporativo transforma a tu equipo en embajadores de marca ambulantes. Ofrecemos camisetas, gorras, uniformes y prendas personalizables que proyectan profesionalismo y unidad. Desde textil económico para eventos masivos hasta prendas premium para ejecutivos, tenemos opciones para vestir equipos completos en Quito, Guayaquil, Bogotá y Medellín.',
    keywords: 'uniformes corporativos, camisetas personalizadas, gorras promocionales, textil con logo, vestuario empresarial ecuador colombia'
  },
  'deportes-y-recreacion': {
    title: 'Artículos Deportivos Promocionales',
    description: 'Productos deportivos y de recreación promocionales. Balones, bandas elásticas, accesorios fitness personalizados. Merchandising deportivo Ecuador y Colombia.',
    content: 'Los artículos deportivos promocionales asocian tu marca con salud, bienestar y estilo de vida activo. Ofrecemos balones, bandas elásticas, accesorios de fitness y artículos de recreación personalizables. Perfectos para empresas de salud, gimnasios, eventos deportivos y campañas de bienestar corporativo en Ecuador y Colombia.',
    keywords: 'artículos deportivos promocionales, balones personalizados, accesorios fitness corporativos, merchandising deportivo, productos recreación ecuador'
  },
  'salud-y-bienestar': {
    title: 'Productos de Salud y Bienestar Promocionales',
    description: 'Artículos de salud, spa y bienestar promocionales. Sets de baño, kits de primeros auxilios, productos wellness personalizados. Ecuador y Colombia.',
    content: 'Los productos de salud y bienestar promocionales demuestran que tu empresa se preocupa por el cuidado de sus clientes y colaboradores. Desde kits de primeros auxilios hasta sets de spa relajantes, cada artículo comunica cuidado y atención. Ideales para empresas de salud, seguros, recursos humanos y campañas de bienestar en Ecuador y Colombia.',
    keywords: 'productos salud promocionales, sets de spa personalizados, kits bienestar corporativos, artículos wellness con logo, merchandising salud ecuador'
  }
};

// Generar rutas estáticas para todas las categorías
export async function generateStaticParams() {
  const categories = Array.from(new Set(productsData.map(p => p.categoria_slug)));
  return categories.map(slug => ({ slug }));
}

// Generar metadata SEO para cada categoría
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const categoryInfo = categoryDescriptions[params.slug];
  const categoryProducts = productsData.filter(p => p.categoria_slug === params.slug);

  if (!categoryInfo || categoryProducts.length === 0) {
    return { title: 'Categoría no encontrada' };
  }

  const categoryName = categoryProducts[0].categoria;
  const title = `${categoryInfo.title} en Ecuador y Colombia | PromoGimmicks`;
  const description = categoryInfo.description;

  return {
    title,
    description,
    keywords: categoryInfo.keywords,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${SITE_URL}/tienda/categoria/${params.slug}/`,
      siteName: 'PromoGimmicks',
      locale: 'es_EC',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
    alternates: {
      canonical: `${SITE_URL}/tienda/categoria/${params.slug}/`,
    },
  };
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const categoryProducts = productsData.filter(p => p.categoria_slug === params.slug);

  if (categoryProducts.length === 0) {
    notFound();
  }

  const categoryName = categoryProducts[0].categoria;
  const categoryInfo = categoryDescriptions[params.slug] || {
    title: categoryName,
    description: `Productos promocionales de ${categoryName}`,
    content: `Explora nuestra selección de productos promocionales de ${categoryName} personalizables con tu logo.`,
    keywords: `${categoryName}, productos promocionales`
  };

  // Schema.org JSON-LD para la categoría
  const categorySchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": categoryInfo.title,
    "description": categoryInfo.description,
    "url": `${SITE_URL}/tienda/categoria/${params.slug}/`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": categoryProducts.length,
      "itemListElement": categoryProducts.slice(0, 10).map((product, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Product",
          "name": product.nombre,
          "url": `${SITE_URL}/tienda/${product.slug}/`,
          "image": `${SITE_URL}${product.imagen_url}`
        }
      }))
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Inicio",
        "item": SITE_URL
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Tienda",
        "item": `${SITE_URL}/tienda/`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": categoryName,
        "item": `${SITE_URL}/tienda/categoria/${params.slug}/`
      }
    ]
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(categorySchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 md:pt-32 pb-16 md:pb-20 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            {/* Breadcrumb */}
            <nav className="inline-flex items-center gap-2 text-blue-200 text-sm">
              <Link href="/" className="hover:text-white transition">Inicio</Link>
              <span>/</span>
              <Link href="/tienda" className="hover:text-white transition">Tienda</Link>
              <span>/</span>
              <span className="text-white">{categoryName}</span>
            </nav>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full border border-white/20">
              <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
              <span className="text-sm md:text-base font-medium">{categoryProducts.length} Productos Disponibles</span>
            </div>

            {/* Título */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              {categoryInfo.title}
            </h1>

            {/* Descripción */}
            <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              {categoryInfo.description}
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 0L60 8.33C120 16.7 240 33.3 360 41.7C480 50 600 50 720 45C840 40 960 30 1080 28.3C1200 26.7 1320 33.3 1380 36.7L1440 40V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="rgb(249, 250, 251)"/>
          </svg>
        </div>
      </section>

      {/* Contenido SEO */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gray-600 text-lg leading-relaxed">
            {categoryInfo.content}
          </p>
        </div>
      </section>

      {/* Grid de Productos */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {categoryProducts.map((product) => (
              <Link
                key={product.id}
                href={`/tienda/${product.slug}/`}
                className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <div className="aspect-square relative bg-gray-100">
                  <Image
                    src={product.imagen_url}
                    alt={`${product.nombre} - Producto promocional personalizable`}
                    fill
                    className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  />
                </div>
                <div className="p-3">
                  <h2 className="text-sm font-medium text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {product.nombre}
                  </h2>
                  {product.codigo && (
                    <p className="text-xs text-gray-500 mt-1">{product.codigo}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-blue-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            ¿Necesitas cotización para {categoryName}?
          </h2>
          <p className="text-blue-100 mb-8">
            Contáctanos por WhatsApp para recibir precios y tiempos de entrega personalizados.
          </p>
          <a
            href="https://wa.me/593987654321?text=Hola,%20me%20interesan%20los%20productos%20de%20la%20categor%C3%ADa%20{categoryName}"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-4 rounded-full transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Cotizar por WhatsApp
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
