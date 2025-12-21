import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductDetailView from '@/components/ProductDetailView';
import productsData from '@/data/products.json';

// Generar parámetros estáticos para todas las páginas de productos (SSG)
export async function generateStaticParams() {
  return productsData.map((product) => ({
    slug: product.slug,
  }));
}

const SITE_URL = 'https://promogimmicks.com';

// Generar metadata para SEO
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = productsData.find(p => p.slug === params.slug);

  if (!product) {
    return {
      title: 'Producto no encontrado',
    };
  }

  const absoluteImageUrl = `${SITE_URL}${product.imagen_url}`;

  return {
    title: `${product.nombre} | PromoGimmicks`,
    description: product.descripcion_corta,
    keywords: `${product.nombre}, productos promocionales, merchandising, ${product.categoria}, regalo corporativo, personalizado`,
    openGraph: {
      title: `${product.nombre} | PromoGimmicks`,
      description: product.descripcion_corta,
      type: 'website',
      url: `${SITE_URL}/tienda/${product.slug}`,
      images: [
        {
          url: absoluteImageUrl,
          width: 800,
          height: 800,
          alt: product.nombre,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.nombre} | PromoGimmicks`,
      description: product.descripcion_corta,
      images: [absoluteImageUrl],
    },
  };
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = productsData.find(p => p.slug === params.slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-20">
        <ProductDetailView product={product} />
      </div>

      <Footer />
    </main>
  );
}
