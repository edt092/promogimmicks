import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { colombia, getCiudadBySlug } from '@/data/geo-data';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TiendaGrid from '@/components/TiendaGrid';
import { MapPin, ArrowRight, CheckCircle, ArrowLeft } from 'lucide-react';

interface Props {
  params: { ciudad: string };
}

export async function generateStaticParams() {
  return colombia.ciudades.map((ciudad) => ({
    ciudad: ciudad.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const ciudad = getCiudadBySlug('productos-promocionales-colombia', params.ciudad);

  if (!ciudad) {
    return {
      title: 'Ciudad no encontrada',
    };
  }

  return {
    title: ciudad.seoTitle,
    description: ciudad.seoDescription,
    keywords: [
      `productos promocionales ${ciudad.nombre.toLowerCase()}`,
      `merchandising ${ciudad.nombre.toLowerCase()}`,
      `artículos publicitarios ${ciudad.nombre.toLowerCase()}`,
      `regalos empresariales ${ciudad.nombre.toLowerCase()}`,
      'productos promocionales colombia',
    ],
    openGraph: {
      title: ciudad.seoTitle,
      description: ciudad.seoDescription,
      type: 'website',
      locale: 'es_CO',
      url: `https://promogimmicks.com/productos-promocionales-colombia/${ciudad.slug}`,
      siteName: 'PromoGimmicks',
    },
    alternates: {
      canonical: `https://promogimmicks.com/productos-promocionales-colombia/${ciudad.slug}`,
    },
  };
}

export default function CiudadColombiaPage({ params }: Props) {
  const ciudad = getCiudadBySlug('productos-promocionales-colombia', params.ciudad);

  if (!ciudad) {
    notFound();
  }

  const otrasCiudades = colombia.ciudades.filter(c => c.slug !== params.ciudad);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        {/* Breadcrumb */}
        <div className="bg-gray-50 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-gray-500 hover:text-amber-600">Inicio</Link>
              <span className="text-gray-400">/</span>
              <Link href="/productos-promocionales-colombia" className="text-gray-500 hover:text-amber-600">Colombia</Link>
              <span className="text-gray-400">/</span>
              <span className="text-amber-600 font-medium">{ciudad.nombre}</span>
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-amber-500 via-amber-600 to-yellow-600 text-white py-16 lg:py-24">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/productos-promocionales-colombia"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft size={18} />
              <span>Volver a Colombia</span>
            </Link>

            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                <MapPin size={24} />
              </div>
              <span className="text-lg text-white/90">Colombia</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              {ciudad.h1}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mb-8">
              {ciudad.intro}
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="https://wa.me/593998594123?text=Hola,%20me%20interesa%20cotizar%20productos%20promocionales%20en%20{ciudad.nombre}"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 text-white px-8 py-4 rounded-full font-bold hover:bg-green-700 transition-colors"
              >
                Cotizar Ahora
                <ArrowRight size={20} />
              </a>
            </div>
          </div>
        </section>

        {/* Características locales */}
        <section className="py-12 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {ciudad.caracteristicas.map((caracteristica, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="text-amber-500 flex-shrink-0 mt-0.5" size={20} />
                  <span className="text-gray-300">{caracteristica}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Productos destacados */}
        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Productos Promocionales Disponibles en {ciudad.nombre}
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Explora nuestra selección de productos promocionales con envío directo a {ciudad.nombre} y alrededores.
              </p>
            </div>

            <TiendaGrid />

            <div className="text-center mt-12">
              <Link
                href="/tienda"
                className="inline-flex items-center gap-2 bg-amber-500 text-white px-8 py-4 rounded-full font-bold hover:bg-amber-600 transition-colors"
              >
                Ver Catálogo Completo
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </section>

        {/* Otras ciudades */}
        <section className="py-16 lg:py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Otras Ciudades en Colombia
              </h2>
              <p className="text-xl text-gray-600">
                También brindamos servicios de productos promocionales en otras ciudades colombianas.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {otrasCiudades.map((otraCiudad) => (
                <Link
                  key={otraCiudad.slug}
                  href={`/productos-promocionales-colombia/${otraCiudad.slug}`}
                  className="bg-white border border-gray-200 hover:border-amber-500 rounded-xl p-4 text-center transition-all hover:shadow-lg"
                >
                  <MapPin className="mx-auto text-amber-500 mb-2" size={24} />
                  <span className="font-medium text-slate-900">{otraCiudad.nombre}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA WhatsApp */}
        <section className="py-16 lg:py-24 bg-slate-900 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              ¿Necesitas productos promocionales en {ciudad.nombre}?
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Contáctanos ahora y recibe atención personalizada para tu empresa en {ciudad.nombre}.
            </p>
            <a
              href={`https://wa.me/593998594123?text=Hola,%20me%20interesa%20cotizar%20productos%20promocionales%20en%20${encodeURIComponent(ciudad.nombre)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 text-white px-8 py-4 rounded-full font-bold hover:bg-green-700 transition-colors"
            >
              Contactar por WhatsApp
              <ArrowRight size={20} />
            </a>
          </div>
        </section>

        {/* Schema.org JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": `PromoGimmicks ${ciudad.nombre}`,
              "description": ciudad.seoDescription,
              "url": `https://promogimmicks.com/productos-promocionales-colombia/${ciudad.slug}`,
              "areaServed": {
                "@type": "City",
                "name": ciudad.nombre,
                "containedInPlace": {
                  "@type": "Country",
                  "name": "Colombia"
                }
              },
              "parentOrganization": {
                "@type": "Organization",
                "name": "PromoGimmicks",
                "url": "https://promogimmicks.com"
              }
            })
          }}
        />
      </main>
      <Footer />
    </>
  );
}
