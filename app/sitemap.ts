import { MetadataRoute } from 'next'
import productsData from '@/data/products.json'
import blogPosts from '@/data/blog-posts.json'

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

  return [...staticPages, ...productPages, ...blogPages]
}
