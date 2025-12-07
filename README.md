# PromoGimmicks - Landing Page

Landing page profesional para PromoGimmicks, empresa especializada en productos promocionales, merchandising e importación.

## Tecnologías Utilizadas

- **Next.js 14** (App Router)
- **React 18**
- **TypeScript**
- **Tailwind CSS** para estilos
- **Framer Motion** para animaciones
- **Lucide React** para iconos

## Estructura del Proyecto

```
promogimmicks/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Navbar.tsx
│   ├── HeroSection.tsx
│   ├── ProductosVirales.tsx
│   ├── Catalogos.tsx
│   ├── Servicios.tsx
│   ├── ProductosGallery.tsx
│   ├── ContactSection.tsx
│   └── Footer.tsx
├── public/
│   ├── videos/
│   │   └── hero-video.mp4
│   └── img/
│       ├── imagenes-productos-virales/
│       │   ├── 1.jpg
│       │   ├── 2.jpg
│       │   ├── 3.jpg
│       │   ├── 4.jpg
│       │   └── 5.jpg
│       ├── catalogos/
│       │   ├── premiums.jpg
│       │   ├── mp.jpg
│       │   ├── cdo.jpg
│       │   └── bs.jpg
│       └── imagenes-de-stock/
│           ├── 1.jpg
│           ├── 2.jpg
│           └── ... (hasta 12.jpg)
```

## Instalación

1. Clonar el repositorio
2. Instalar dependencias:

```bash
npm install
```

## Configuración de Imágenes

Debes agregar las siguientes imágenes en la carpeta `public/`:

### Video Hero (Required)
- Ubicación: `public/videos/hero-video.mp4`
- Recomendación: Video de marketing/merchandising de 10-30 segundos
- Formato: MP4
- Resolución: 1920x1080 o superior

### Productos Virales
- Ubicación: `public/img/imagenes-productos-virales/`
- Archivos: 1.jpg, 2.jpg, 3.jpg, 4.jpg, 5.jpg
- Dimensiones recomendadas: 400x260px o proporción similar
- Formato: JPG o PNG

### Catálogos
- Ubicación: `public/img/catalogos/`
- Archivos: premiums.jpg, mp.jpg, cdo.jpg, bs.jpg
- Dimensiones recomendadas: 400x400px (cuadradas)
- Formato: JPG o PNG

### Galería de Productos (Stock)
- Ubicación: `public/img/imagenes-de-stock/`
- Archivos: 1.jpg hasta 12.jpg
- Dimensiones recomendadas: 600x600px
- Formato: JPG o PNG

## Ejecutar en Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Build para Producción

```bash
npm run build
npm start
```

## Características

### Navbar
- Sticky con efecto glassmorphism
- Menú responsive para móviles
- Navegación smooth scroll

### Hero Section
- Video de fondo con overlay
- Animaciones de entrada con Framer Motion
- Call-to-actions destacados

### Productos Virales
- Layout de 2 columnas
- Slider automático de imágenes
- Controles manuales y indicadores

### Catálogos
- Grid de 4 columnas responsive
- Hover effects con zoom y bordes animados
- Enlaces externos a catálogos

### Servicios
- Tarjetas con iconos personalizados
- Animaciones en hover
- Layout de 3 columnas

### Galería de Productos
- Grid masonry responsive
- Efectos de hover con escalado
- Optimización de imágenes con Next.js Image

### Formulario de Contacto
- Validación de campos
- Sección de redes sociales
- Información de contacto adicional

### Footer
- Información completa de ubicaciones
- Enlaces rápidos
- Diseño multi-columna responsive

## Paleta de Colores

- **Azul Profundo**: `#1e3a8a` (bg-blue-900) - Encabezados y elementos de autoridad
- **Blanco**: `#ffffff` - Fondos principales
- **Gris Claro**: `bg-slate-50` - Separadores de sección
- **Naranja Acento**: `bg-orange-500` - CTAs y detalles importantes

## Personalización

### Actualizar Información de Contacto
Edita `components/Footer.tsx` y `components/ContactSection.tsx`

### Modificar Enlaces de Catálogos
Edita el array `catalogos` en `components/Catalogos.tsx`

### Cambiar Colores
Actualiza las clases de Tailwind en los componentes o modifica `tailwind.config.ts`

## Contacto

- Email: info@promogimmicks.com
- Teléfono: +593 99 859 4123
- Oficinas: Calle 145 #7B-58, Cedritos, Bogotá
- Planta: Carrera 54 #5B-25, Zona Industrial, Bogotá
- Bodega: Transversal 28ª #37-70, Bogotá, Colombia
