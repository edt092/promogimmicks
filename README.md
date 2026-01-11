# PromoGimmicks

Landing page y tienda de productos promocionales para PromoGimmicks, empresa especializada en merchandising e importación para Colombia y Ecuador.

## Stack Tecnologico

| Tecnologia | Version | Uso |
|------------|---------|-----|
| Next.js | 14.x | Framework React con App Router |
| React | 18.x | Biblioteca UI |
| TypeScript | 5.x | Tipado estatico |
| Tailwind CSS | 3.4.x | Framework CSS utility-first |
| Framer Motion | 11.x | Animaciones |
| Lucide React | 0.462.x | Iconos |

## Arquitectura del Proyecto

```
promogimmicks/
├── app/                          # App Router (Next.js 14)
│   ├── layout.tsx                # Layout principal
│   ├── page.tsx                  # Pagina principal
│   ├── globals.css               # Estilos globales
│   ├── robots.ts                 # Configuracion robots.txt
│   ├── sitemap.ts                # Generador sitemap XML
│   ├── blog/                     # Seccion blog
│   │   ├── page.tsx              # Listado de articulos
│   │   └── [slug]/page.tsx       # Articulo individual
│   ├── tienda/                   # Tienda de productos
│   │   ├── page.tsx              # Catalogo principal
│   │   ├── [slug]/page.tsx       # Detalle de producto
│   │   └── categoria/[slug]/     # Productos por categoria
│   ├── productos-promocionales-colombia/  # SEO Colombia
│   │   ├── page.tsx
│   │   └── [ciudad]/page.tsx
│   └── productos-promocionales-ecuador/   # SEO Ecuador
│       ├── page.tsx
│       └── [ciudad]/page.tsx
│
├── components/                   # Componentes reutilizables
│   ├── Navbar.tsx                # Navegacion principal
│   ├── HeroSection.tsx           # Seccion hero con video
│   ├── Cobertura.tsx             # Mapa de cobertura
│   ├── ProductosVirales.tsx      # Slider productos destacados
│   ├── Catalogos.tsx             # Grid de catalogos
│   ├── Servicios.tsx             # Servicios ofrecidos
│   ├── TiendaPromo.tsx           # Preview tienda en home
│   ├── TiendaGrid.tsx            # Grid de productos tienda
│   ├── ProductCard.tsx           # Tarjeta de producto
│   ├── ProductDetailView.tsx     # Vista detalle producto
│   ├── ProductosGallery.tsx      # Galeria de imagenes
│   ├── ContactSection.tsx        # Formulario de contacto
│   ├── Footer.tsx                # Pie de pagina
│   ├── BlogCard.tsx              # Tarjeta de articulo
│   ├── GoldenShimmerText.tsx     # Texto con efecto dorado
│   └── blog/                     # Componentes especificos blog
│       ├── BlogPostContent.tsx
│       ├── BlogNavidadContent.tsx
│       ├── BlogQuitoContent.tsx
│       ├── CTABanner.tsx
│       └── ProductShowcase.tsx
│
├── data/                         # Datos estaticos
│   ├── products.json             # Catalogo de productos
│   ├── blog-posts.json           # Articulos del blog
│   └── geo-data.ts               # Datos geograficos SEO
│
├── public/                       # Assets estaticos
│   ├── img/                      # Imagenes
│   └── videos/                   # Videos
│
└── Configuracion
    ├── next.config.js            # Configuracion Next.js
    ├── tailwind.config.ts        # Configuracion Tailwind
    ├── tsconfig.json             # Configuracion TypeScript
    └── postcss.config.mjs        # Configuracion PostCSS
```

## Funcionalidades

### Pagina Principal
- Hero con video de fondo y animaciones
- Slider de productos virales con autoplay
- Mapa interactivo de cobertura (Colombia/Ecuador)
- Grid de catalogos con hover effects
- Seccion de servicios
- Preview de productos de la tienda
- Galeria de productos
- Formulario de contacto

### Tienda
- Catalogo completo con filtros por categoria
- Vista de detalle de producto
- Integracion con WhatsApp para cotizaciones
- Paginas SEO por categoria

### Blog
- Articulos con contenido dinamico
- Componentes interactivos (CTAs, showcases)
- Optimizacion SEO

### SEO
- Paginas especificas por ciudad (Colombia y Ecuador)
- Sitemap XML dinamico
- Robots.txt configurado
- Meta tags optimizados

## Instalacion

```bash
# Clonar repositorio
git clone https://github.com/edt092/promogimmicks.git

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Build produccion
npm run build
npm start
```

## Scripts Disponibles

| Comando | Descripcion |
|---------|-------------|
| `npm run dev` | Inicia servidor de desarrollo en http://localhost:3000 |
| `npm run build` | Genera build de produccion |
| `npm start` | Inicia servidor de produccion |
| `npm run lint` | Ejecuta ESLint |

## Configuracion de Imagenes

Las imagenes deben ubicarse en `public/`:

- **Video Hero**: `public/videos/hero-video.mp4` (MP4, 1920x1080)
- **Productos Virales**: `public/img/imagenes-productos-virales/` (1.jpg - 5.jpg)
- **Catalogos**: `public/img/catalogos/` (premiums.jpg, mp.jpg, cdo.jpg, bs.jpg)
- **Galeria**: `public/img/imagenes-de-stock/` (1.jpg - 12.jpg)

## Paleta de Colores

| Color | Codigo | Uso |
|-------|--------|-----|
| Azul Profundo | `#1e3a8a` | Encabezados, autoridad |
| Ambar/Dorado | `#f59e0b` | CTAs, acentos |
| Blanco | `#ffffff` | Fondos principales |
| Gris Claro | `#f8fafc` | Separadores |

## Estructura de Datos

### products.json
```json
{
  "id": "string",
  "name": "string",
  "category": "string",
  "description": "string",
  "price": "string",
  "image": "string",
  "slug": "string"
}
```

### blog-posts.json
```json
{
  "id": "string",
  "title": "string",
  "slug": "string",
  "excerpt": "string",
  "image": "string",
  "date": "string",
  "author": "string"
}
```

## Contacto

- **Email**: info@promogimmicks.com
- **Telefono**: +593 99 859 4123
- **Oficinas**: Calle 145 #7B-58, Cedritos, Bogota

## Licencia

Proyecto privado - Todos los derechos reservados.
