import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BlogCard from '@/components/BlogCard';
import blogPosts from '@/data/blog-posts.json';
import { BookOpen, TrendingUp, Lightbulb } from 'lucide-react';

export const metadata = {
  title: 'Blog - PromoGimmicks | Consejos de Marketing y Productos Promocionales',
  description: 'Descubre guías, consejos y tendencias sobre productos promocionales, merchandising y marketing. Aprende a impulsar tu marca con estrategias efectivas.',
};

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      {/* Hero Section */}
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
              <BookOpen size={16} />
              <span className="text-sm md:text-base font-medium">Blog PromoGimmicks</span>
            </div>

            {/* Título */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Consejos y Estrategias
              <span className="block text-amber-400 mt-2">para tu Marca</span>
            </h1>

            {/* Descripción */}
            <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Descubre guías prácticas, tendencias del mercado y consejos expertos
              para maximizar el impacto de tus productos promocionales.
            </p>

            {/* Categorías destacadas */}
            <div className="flex flex-wrap justify-center gap-4 pt-6">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                <Lightbulb size={18} className="text-amber-400" />
                <span className="text-white text-sm">Guías Prácticas</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                <TrendingUp size={18} className="text-amber-400" />
                <span className="text-white text-sm">Tendencias 2025</span>
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

      {/* Blog Posts Grid */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>

          {blogPosts.length === 0 && (
            <div className="text-center py-20">
              <BookOpen className="mx-auto text-gray-300 mb-6" size={80} />
              <h3 className="text-2xl font-bold text-gray-700 mb-3">Próximamente más contenido</h3>
              <p className="text-gray-500">Estamos preparando artículos increíbles para ti.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-900 to-blue-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            ¿Listo para impulsar tu marca?
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            Explora nuestro catálogo de productos promocionales y encuentra el regalo perfecto para tu empresa.
          </p>
          <a
            href="/tienda"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Ver Catálogo de Productos
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
