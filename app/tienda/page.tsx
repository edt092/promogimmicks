import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TiendaGrid from '@/components/TiendaGrid';
import ChatAdri from '@/components/ChatAdri';

export const metadata = {
  title: 'Tienda - PromoGimmicks | Productos Promocionales',
  description: 'Explora nuestro catálogo completo de productos promocionales. Artículos de escritura, drinkware, tecnología, textil y más.',
};

export default function TiendaPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      {/* Hero Section Mejorado */}
      <section className="relative pt-24 md:pt-32 pb-16 md:pb-20 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 overflow-hidden">
        {/* Decoración de fondo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full border border-white/20">
              <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
              <span className="text-sm md:text-base font-medium">199+ Productos Disponibles</span>
            </div>

            {/* Título */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight">
              Catálogo de Productos
              <span className="block text-amber-400 mt-2">Promocionales</span>
            </h1>

            {/* Descripción */}
            <p className="text-lg md:text-xl lg:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Encuentra el regalo corporativo perfecto para tu empresa.
              <span className="block mt-2 text-white/90">Personalización garantizada con tu logo.</span>
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-6 md:gap-12 pt-8">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-amber-400">199+</div>
                <div className="text-sm md:text-base text-blue-200 mt-1">Productos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-amber-400">11</div>
                <div className="text-sm md:text-base text-blue-200 mt-1">Categorías</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-amber-400">100%</div>
                <div className="text-sm md:text-base text-blue-200 mt-1">Personalizables</div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 0L60 8.33C120 16.7 240 33.3 360 41.7C480 50 600 50 720 45C840 40 960 30 1080 28.3C1200 26.7 1320 33.3 1380 36.7L1440 40V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="rgb(249, 250, 251)"/>
          </svg>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <TiendaGrid />
        </div>
      </section>

      <Footer />
      <ChatAdri />
    </main>
  );
}
