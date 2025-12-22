import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BlogPostContent from '@/components/blog/BlogPostContent';
import blogPosts from '@/data/blog-posts.json';

const SITE_URL = 'https://promogimmicks.com';

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = blogPosts.find(p => p.slug === params.slug);

  if (!post) {
    return {
      title: 'Artículo no encontrado',
    };
  }

  return {
    title: post.seo_title,
    description: post.seo_description,
    keywords: post.tags.join(', '),
    openGraph: {
      title: post.seo_title,
      description: post.seo_description,
      type: 'article',
      url: `${SITE_URL}/blog/${post.slug}`,
      images: [
        {
          url: `${SITE_URL}${post.imagen_destacada}`,
          width: 1200,
          height: 630,
          alt: post.titulo,
        },
      ],
      publishedTime: post.fecha_publicacion,
      authors: [post.autor],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.seo_title,
      description: post.seo_description,
      images: [`${SITE_URL}${post.imagen_destacada}`],
    },
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts.find(p => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <BlogPostContent post={post} />
      <Footer />
    </main>
  );
}
