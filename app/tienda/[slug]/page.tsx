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

  // Usar campos SEO del JSON con localización para Ecuador y Colombia
  const baseTitle = product.seo_title || `${product.nombre} Personalizado`;
  const title = `${baseTitle} | Ecuador y Colombia`;
  const description = `${product.seo_description || product.descripcion_corta} Envíos a Quito, Guayaquil, Bogotá y Medellín.`;
  const keywords = product.seo_keywords || `${product.nombre}, productos promocionales, merchandising, ${product.categoria}, regalo corporativo, personalizado`;

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${SITE_URL}/tienda/${product.slug}/`,
      siteName: 'PromoGimmicks',
      locale: 'es_EC',
      images: [
        {
          url: absoluteImageUrl,
          width: 800,
          height: 800,
          alt: `${product.nombre} - Producto promocional personalizable`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [absoluteImageUrl],
    },
    alternates: {
      canonical: `${SITE_URL}/tienda/${product.slug}/`,
    },
  };
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = productsData.find(p => p.slug === params.slug);

  if (!product) {
    notFound();
  }

  // Schema.org JSON-LD para productos
  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.nombre,
    "image": `${SITE_URL}${product.imagen_url}`,
    "description": product.seo_description || product.descripcion_corta,
    "brand": {
      "@type": "Brand",
      "name": "PromoGimmicks"
    },
    "offers": {
      "@type": "Offer",
      "url": `${SITE_URL}/tienda/${product.slug}/`,
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "PromoGimmicks"
      },
      "areaServed": [
        { "@type": "Country", "name": "Ecuador" },
        { "@type": "Country", "name": "Colombia" }
      ]
    },
    "category": product.categoria
  };

  // Schema.org para BreadcrumbList
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
        "name": product.categoria,
        "item": `${SITE_URL}/tienda/categoria/${product.categoria_slug}/`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": product.nombre,
        "item": `${SITE_URL}/tienda/${product.slug}/`
      }
    ]
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Navbar />

      <div className="pt-20">
        <ProductDetailView product={product} />
      </div>

      <Footer />
    </main>
  );
}
