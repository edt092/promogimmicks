import { MetadataRoute } from 'next'
import productsData from '@/data/products.json'
import blogPosts from '@/data/blog-posts.json'
import { colombia, ecuador } from '@/data/geo-data'

const SITE_URL = 'https://promogimmicks.com'

export default function sitemap(): MetadataRoute.Sitemap {
  // Páginas estáticas principales
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/tienda`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]

  // Páginas geográficas - Colombia
  const colombiaPages: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/productos-promocionales-colombia`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    ...colombia.ciudades.map((ciudad) => ({
      url: `${SITE_URL}/productos-promocionales-colombia/${ciudad.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    })),
  ]

  // Páginas geográficas - Ecuador
  const ecuadorPages: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/productos-promocionales-ecuador`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    ...ecuador.ciudades.map((ciudad) => ({
      url: `${SITE_URL}/productos-promocionales-ecuador/${ciudad.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    })),
  ]

  // Obtener categorías únicas
  const uniqueCategories = Array.from(new Set(productsData.map(p => p.categoria_slug)))

  // Páginas de categorías
  const categoryPages: MetadataRoute.Sitemap = uniqueCategories.map((categorySlug) => ({
    url: `${SITE_URL}/tienda/categoria/${categorySlug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }))

  // Páginas de productos
  const productPages: MetadataRoute.Sitemap = productsData.map((product) => ({
    url: `${SITE_URL}/tienda/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Páginas del blog
  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.fecha_publicacion),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [...staticPages, ...colombiaPages, ...ecuadorPages, ...categoryPages, ...productPages, ...blogPages]
}
