import { Metadata } from 'next';
import Link from 'next/link';
import { colombia } from '@/data/geo-data';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { MapPin, ArrowRight, CheckCircle, Package, Truck, Award } from 'lucide-react';

export const metadata: Metadata = {
  title: colombia.seoTitle,
  description: colombia.seoDescription,
  keywords: [
    'productos promocionales colombia',
    'merchandising colombia',
    'artículos publicitarios colombia',
    'regalos empresariales colombia',
    'productos promocionales bogotá',
    'productos promocionales medellín',
    'productos promocionales cali',
    'productos promocionales barranquilla',
    'productos promocionales cartagena'
  ],
  openGraph: {
    title: colombia.seoTitle,
    description: colombia.seoDescription,
    type: 'website',
    locale: 'es_CO',
    url: 'https://promogimmicks.com/productos-promocionales-colombia',
    siteName: 'PromoGimmicks',
  },
  alternates: {
    canonical: 'https://promogimmicks.com/productos-promocionales-colombia',
  },
};

export default function ColombiaPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-amber-500 via-amber-600 to-yellow-600 text-white py-20 lg:py-28">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <MapPin size={18} />
                <span className="text-sm font-medium">Cobertura Nacional en Colombia</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                {colombia.h1}
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8">
                {colombia.intro}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/tienda"
                  className="inline-flex items-center gap-2 bg-white text-amber-600 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-colors"
                >
                  Ver Catálogo Completo
                  <ArrowRight size={20} />
                </Link>
                <Link
                  href="#ciudades"
                  className="inline-flex items-center gap-2 bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-colors"
                >
                  Explorar por Ciudad
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-amber-500 mb-2">199+</div>
                <div className="text-gray-400">Productos Disponibles</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-amber-500 mb-2">5</div>
                <div className="text-gray-400">Ciudades Principales</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-amber-500 mb-2">24h</div>
                <div className="text-gray-400">Respuesta Rápida</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-amber-500 mb-2">100%</div>
                <div className="text-gray-400">Personalizables</div>
              </div>
            </div>
          </div>
        </section>

        {/* Ciudades Grid */}
        <section id="ciudades" className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Productos Promocionales por Ciudad
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Encuentra productos promocionales en las principales ciudades de Colombia con entrega directa y atención personalizada.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {colombia.ciudades.map((ciudad) => (
                <Link
                  key={ciudad.slug}
                  href={`/productos-promocionales-colombia/${ciudad.slug}`}
                  className="group bg-white border border-gray-200 rounded-2xl p-6 hover:border-amber-500 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-amber-100 text-amber-600 p-3 rounded-xl group-hover:bg-amber-500 group-hover:text-white transition-colors">
                      <MapPin size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-amber-600 transition-colors">
                        {ciudad.nombre}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {ciudad.intro.substring(0, 120)}...
                      </p>
                      <div className="flex items-center gap-2 text-amber-600 font-medium">
                        <span>Ver productos</span>
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Beneficios */}
        <section className="py-16 lg:py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                ¿Por qué elegirnos en Colombia?
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="bg-amber-100 text-amber-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                  <Package size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Amplio Catálogo
                </h3>
                <p className="text-gray-600">
                  Más de 199 productos promocionales en categorías como tecnología, oficina, textiles, drinkware y más.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="bg-amber-100 text-amber-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                  <Truck size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Envíos a Todo Colombia
                </h3>
                <p className="text-gray-600">
                  Cobertura nacional con envíos a Bogotá, Medellín, Cali, Barranquilla, Cartagena y todas las ciudades del país.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="bg-amber-100 text-amber-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                  <Award size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Calidad Garantizada
                </h3>
                <p className="text-gray-600">
                  Trabajamos con las mejores marcas y materiales para asegurar productos promocionales de alta calidad.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Categorías Populares */}
        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Categorías Populares en Colombia
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { nombre: 'Tecnología', slug: 'tecnologia' },
                { nombre: 'Drinkware', slug: 'drinkware' },
                { nombre: 'Oficina', slug: 'oficina' },
                { nombre: 'Textiles', slug: 'textil-vestuario' },
                { nombre: 'Bolsos', slug: 'bolsos-mochilas' },
                { nombre: 'Eco', slug: 'eco' },
                { nombre: 'Deportes', slug: 'deportes-recreacion' },
                { nombre: 'Accesorios', slug: 'accesorios' },
              ].map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/tienda/categoria/${cat.slug}`}
                  className="bg-gray-100 hover:bg-amber-100 text-slate-900 hover:text-amber-700 px-6 py-4 rounded-xl text-center font-medium transition-colors"
                >
                  {cat.nombre}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-16 lg:py-24 bg-slate-900 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              ¿Listo para impulsar tu marca en Colombia?
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Contáctanos hoy y recibe una cotización personalizada para tus productos promocionales.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/tienda"
                className="inline-flex items-center gap-2 bg-amber-500 text-white px-8 py-4 rounded-full font-bold hover:bg-amber-600 transition-colors"
              >
                Explorar Productos
                <ArrowRight size={20} />
              </Link>
              <a
                href="https://wa.me/593998594123?text=Hola,%20me%20interesa%20cotizar%20productos%20promocionales%20para%20Colombia"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 text-white px-8 py-4 rounded-full font-bold hover:bg-green-700 transition-colors"
              >
                Cotizar por WhatsApp
              </a>
            </div>
          </div>
        </section>

        {/* Schema.org JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "PromoGimmicks Colombia",
              "description": colombia.seoDescription,
              "url": "https://promogimmicks.com/productos-promocionales-colombia",
              "areaServed": {
                "@type": "Country",
                "name": "Colombia"
              },
              "serviceArea": colombia.ciudades.map(c => ({
                "@type": "City",
                "name": c.nombre
              }))
            })
          }}
        />
      </main>
      <Footer />
    </>
  );
}
