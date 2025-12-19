# Guía Completa: Scraping y SSG para KS Promocionales

## 📋 Índice
- [Visión General](#visión-general)
- [Arquitectura del Sistema](#arquitectura-del-sistema)
- [Configuración Inicial](#configuración-inicial)
- [Proceso de Scraping](#proceso-de-scraping)
- [Generación de Páginas Estáticas](#generación-de-páginas-estáticas)
- [Optimización SEO](#optimización-seo)
- [Despliegue en Netlify](#despliegue-en-netlify)
- [FAQ](#faq)

---

## 🎯 Visión General

Este proyecto implementa una estrategia **JSON + SSG (Static Site Generation)** para crear un catálogo de productos promocionales optimizado para SEO y rendimiento.

### ¿Por qué SSG?

**Ventajas:**
- ✅ **SEO Perfecto**: Google lee HTML estático directamente
- ✅ **Carga Ultra Rápida**: Sin JavaScript pesado ni hidratación
- ✅ **Hosting Gratis**: Netlify, Vercel, GitHub Pages
- ✅ **Miles de Páginas**: El tiempo de build aumenta, pero la web sigue liviana
- ✅ **Sin Servidor**: Todo es estático, sin costos de backend

**Lo que NO es pesado:**
- Tener 1000+ páginas de productos NO hace tu web pesada
- Cada visitante solo carga la página que visita
- Solo el build toma más tiempo

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                    FLUJO DEL SISTEMA                        │
└─────────────────────────────────────────────────────────────┘

1. SCRAPING
   catalogospromocionales.com
           ↓
   [scraper_subcategorias.py]
           ↓
   productos_scraped.json (datos crudos)

2. OPTIMIZACIÓN
   productos_scraped.json
           ↓
   [convertir_a_nextjs.py]
           ↓
   products_generated.json (formato Next.js)
   categories_generated.json

3. BUILD SSG
   Next.js lee products.json
           ↓
   generateStaticParams() genera rutas
   generateMetadata() genera SEO
           ↓
   npm run build
           ↓
   out/ (HTML estático)

4. DEPLOY
   out/ → Netlify
           ↓
   kronossolopromocionales.com
```

---

## ⚙️ Configuración Inicial

### 1. Requisitos

**Python:**
```bash
cd promo-scraper
pip install -r requirements.txt
```

Dependencias:
- requests
- beautifulsoup4
- lxml

**Node.js:**
```bash
npm install
```

### 2. Verificar Configuración Next.js

El archivo `next.config.js` debe tener:
```javascript
const nextConfig = {
  output: 'export',  // ← CRUCIAL para SSG
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}
```

---

## 🔍 Proceso de Scraping

### Opción 1: Script Automatizado (Recomendado)

```bash
cd promo-scraper
python ejecutar_scraping_completo.py
```

Este script ejecuta automáticamente:
1. Scraping de productos
2. Conversión a formato Next.js
3. Generación de categorías

### Opción 2: Paso a Paso

#### Paso 1: Scrapear Productos

```bash
python scraper_subcategorias.py
```

**Configuración disponible:**
```python
MAX_CATEGORIAS = None  # None = todas
MAX_PRODUCTOS_POR_CATEGORIA = 100
DELAY_ENTRE_CATEGORIAS = 2  # segundos
```

**Salida:**
- `data/productos_scraped.json`

**Datos extraídos:**
```json
{
  "id": "boligrafo-ejecutivo",
  "nombre": "Bolígrafo Ejecutivo Premium",
  "slug": "boligrafo-ejecutivo-premium",
  "categoria": "Artículos de Escritura",
  "descripcion": "Bolígrafo personalizado con logo...",
  "imagen_url": "https://...",
  "seo_title": "Bolígrafo Ejecutivo Personalizado...",
  "keywords": "boligrafo, regalo corporativo..."
}
```

#### Paso 2: Convertir a Formato Next.js

```bash
python convertir_a_nextjs.py
```

**Salida:**
- `data/products_generated.json`
- `data/categories_generated.json`

**Formato generado:**
```json
{
  "id": "boligrafo-ejecutivo",
  "name": "Bolígrafo Ejecutivo Premium",
  "slug": "boligrafo-ejecutivo-premium",
  "categoryId": "articulos-escritura",
  "shortDescription": "Bolígrafo personalizado...",
  "story": "Historia de marca optimizada...",
  "features": ["Impresión de alta calidad", ...],
  "images": ["https://..."],
  "seoTitle": "Bolígrafo Ejecutivo Personalizado Ecuador",
  "seoDescription": "Compra bolígrafos ejecutivos...",
  "useCases": ["Regalos corporativos", ...],
  "whatsappMessage": "Hola! Me interesa..."
}
```

### Optimizaciones Aplicadas

**1. Nombres Optimizados:**
- Elimina códigos de referencia
- Capitalización correcta
- Limpia caracteres especiales

**2. Descripciones SEO:**
- Incluye keywords relevantes
- Menciona personalización y logo
- Incluye ubicación (Ecuador)
- Sin precios

**3. Keywords Automáticas:**
- Nombre del producto
- Variaciones con "personalizado"
- Categoría
- Términos genéricos ("regalo corporativo")

---

## 🏭 Generación de Páginas Estáticas

### Cómo Funciona el SSG

**1. generateStaticParams()**

En `src/app/productos/[slug]/page.jsx`:
```javascript
export function generateStaticParams() {
  return productsData.map((product) => ({
    slug: product.slug,
  }));
}
```

**Lo que hace:**
- Lee `products.json`
- Por cada producto, genera `/productos/[slug]/`
- Next.js crea HTML estático en build time

**2. generateMetadata()**

```javascript
export async function generateMetadata({ params }) {
  const product = productsData.find(p => p.slug === params.slug);

  return {
    title: product.seoTitle,
    description: product.seoDescription,
    keywords: product.keywords,
    openGraph: { ... },
    twitter: { ... }
  };
}
```

**Lo que hace:**
- Genera `<title>`, `<meta>` tags
- Open Graph para redes sociales
- Twitter Cards
- Todo en HTML estático

### Build del Proyecto

```bash
npm run build
```

**Proceso:**
1. Next.js lee `data/products.json`
2. Genera HTML para cada producto
3. Optimiza imágenes y assets
4. Crea sitemap.xml
5. Output en carpeta `out/`

**Estructura generada:**
```
out/
├── index.html
├── productos/
│   ├── boligrafo-ejecutivo-premium/
│   │   └── index.html
│   ├── mug-ceramica-sublimacion/
│   │   └── index.html
│   └── ... (1000+ páginas)
├── categorias/
│   └── ...
└── _next/
    └── static/
```

### Verificar Build

```bash
# Ver tamaño total
npm run build

# Servir localmente
npx serve out
```

**Indicadores de éxito:**
- ✅ Carpeta `out/` creada
- ✅ Archivo por cada producto: `out/productos/[slug]/index.html`
- ✅ Cada HTML contiene metadata completa
- ✅ Sin errores de build

---

## 🚀 Optimización SEO

### Metadata Implementada

#### 1. Title y Description
```html
<title>Bolígrafo Ejecutivo Personalizado Ecuador | KS Promocionales</title>
<meta name="description" content="Compra bolígrafos ejecutivos personalizados...">
```

#### 2. Keywords
```html
<meta name="keywords" content="boligrafo ejecutivo, boligrafo personalizado, regalo corporativo">
```

#### 3. Open Graph (Facebook, LinkedIn)
```html
<meta property="og:title" content="Bolígrafo Ejecutivo Personalizado">
<meta property="og:description" content="...">
<meta property="og:image" content="https://...">
<meta property="og:type" content="product">
```

#### 4. Twitter Cards
```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="...">
<meta name="twitter:image" content="...">
```

#### 5. Canonical URL
```html
<link rel="canonical" href="https://kronossolopromocionales.com/productos/boligrafo-ejecutivo/">
```

### Schema.org (Structured Data)

Para mejorar aún más el SEO, considera agregar:

```javascript
// En page.jsx
const productSchema = {
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": product.name,
  "image": product.images[0],
  "description": product.shortDescription,
  "brand": {
    "@type": "Brand",
    "name": "KS Promocionales"
  }
};
```

---

## 🌐 Despliegue en Netlify

### Configuración Netlify

**1. Conectar Repositorio**
- GitHub/GitLab/Bitbucket

**2. Build Settings**
```yaml
Base directory: kspromocionales-tienda
Build command: npm run build
Publish directory: kspromocionales-tienda/out
```

**3. netlify.toml (opcional)**
```toml
[build]
  base = "kspromocionales-tienda"
  publish = "out"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/404.html"
  status = 404
```

### Deploy Manual

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod --dir=out
```

### Ventajas de SSG en Netlify

- ✅ **Gratis**: Hasta 100GB bandwidth/mes
- ✅ **CDN Global**: Carga rápida worldwide
- ✅ **SSL Automático**: HTTPS gratis
- ✅ **Deploy en segundos**: Solo archivos estáticos
- ✅ **Sin servidor**: Hosting puro

---

## 📊 Rendimiento

### Métricas Esperadas

**Con SSG:**
- First Contentful Paint: < 1s
- Time to Interactive: < 2s
- SEO Score: 100/100
- Lighthouse Performance: 95+

**Comparación:**

| Métrica | SSG | CSR (Client Side) |
|---------|-----|-------------------|
| FCP | 0.8s | 3.5s |
| TTI | 1.5s | 5s |
| SEO | 100 | 60 |
| Costo | $0 | $50+/mes |

---

## ❓ FAQ

### ¿Cuántos productos puede manejar?

- **Sin límite práctico**: 10,000+ productos
- Build time aumenta (10-30 min para 5000 productos)
- El sitio final sigue siendo liviano

### ¿Cómo actualizar productos?

1. Ejecutar scraping nuevamente
2. Reemplazar `products.json`
3. `npm run build`
4. Deploy a Netlify

### ¿Puedo automatizar el scraping?

Sí, con GitHub Actions:
```yaml
# .github/workflows/scrape.yml
on:
  schedule:
    - cron: '0 2 * * *' # Diario 2am
jobs:
  scrape:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: python promo-scraper/ejecutar_scraping_completo.py
      - run: npm run build
      # Deploy automático
```

### ¿Qué pasa si quiero precios?

El scraper actual NO extrae precios (por diseño).
Para agregar precios:
1. Modifica `scraper_subcategorias.py`
2. Agrega campo `precio` en el schema
3. No lo muestres públicamente (evita problemas legales)

### ¿Funciona con otros catálogos?

Sí, solo necesitas:
1. Adaptar los selectores CSS en `scraper_subcategorias.py`
2. La lógica de conversión es genérica

---

## 🛠️ Troubleshooting

### Error: "No se encontraron productos"

**Causa:** Cambios en la estructura HTML del sitio fuente
**Solución:**
1. Inspeccionar catalogospromocionales.com
2. Actualizar selectores en `scraper_subcategorias.py`

### Build falla con productos grandes

**Causa:** Archivo JSON muy grande
**Solución:**
```bash
# Aumentar memoria de Node.js
NODE_OPTIONS=--max-old-space-size=4096 npm run build
```

### Imágenes no cargan

**Causa:** URLs relativas o dominio bloqueado
**Solución:**
1. Verificar `next.config.js` → `remotePatterns`
2. Descargar imágenes localmente

---

## 📚 Recursos Adicionales

- [Next.js Static Exports](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [generateStaticParams](https://nextjs.org/docs/app/api-reference/functions/generate-static-params)
- [generateMetadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Netlify Deployment](https://docs.netlify.com/)

---

## ✅ Checklist de Implementación

- [ ] Instalar dependencias Python y Node
- [ ] Ejecutar scraping completo
- [ ] Verificar archivos JSON generados
- [ ] Revisar muestra de productos
- [ ] Ejecutar `npm run build` exitosamente
- [ ] Verificar páginas en `out/`
- [ ] Configurar Netlify
- [ ] Deploy a producción
- [ ] Verificar SEO con Google Search Console
- [ ] Probar rendimiento con Lighthouse

---

**Última actualización:** Diciembre 2024
**Versión:** 1.0.0
**Contacto:** KS Promocionales Ecuador
