'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Clock, Tag, ArrowRight, Calendar } from 'lucide-react';

interface BlogPost {
  id: string;
  slug: string;
  titulo: string;
  extracto: string;
  imagen_destacada: string;
  categoria: string;
  fecha_publicacion: string;
  tiempo_lectura: string;
  autor: string;
  tags: string[];
}

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imgRef.current?.complete) {
      setIsLoaded(true);
    }
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-blue-200 transform hover:-translate-y-2"
    >
      {/* Imagen */}
      <div className="relative h-48 md:h-56 bg-gradient-to-br from-blue-100 to-blue-50 overflow-hidden">
        {!isLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-amber-50 animate-pulse" />
        )}

        <img
          ref={imgRef}
          src={imageError ? "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=450&fit=crop&q=80" : post.imagen_destacada}
          alt={post.titulo}
          onError={() => setImageError(true)}
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Categoría badge */}
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center gap-1 bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
            <Tag size={12} />
            {post.categoria}
          </span>
        </div>

        {/* Tiempo de lectura */}
        <div className="absolute top-4 right-4">
          <span className="inline-flex items-center gap-1 bg-white/90 backdrop-blur-sm text-blue-900 text-xs font-medium px-3 py-1.5 rounded-full shadow">
            <Clock size={12} />
            {post.tiempo_lectura}
          </span>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-6">
        {/* Fecha */}
        <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
          <Calendar size={14} />
          <span>{formatDate(post.fecha_publicacion)}</span>
        </div>

        {/* Título */}
        <h3 className="text-xl font-bold text-blue-900 mb-3 line-clamp-2 group-hover:text-blue-700 transition-colors duration-300">
          {post.titulo}
        </h3>

        {/* Extracto */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
          {post.extracto}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-md"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <span className="text-sm text-gray-500">Por {post.autor}</span>
          <span className="inline-flex items-center gap-2 text-blue-900 font-semibold text-sm group-hover:text-amber-500 transition-colors">
            Leer más
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
}
