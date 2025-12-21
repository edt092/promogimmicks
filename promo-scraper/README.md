# Sistema de Scraping y Generación de Contenido SEO

Este sistema automatizado extrae productos de catalogospromocionales.com, genera meta descripciones únicas optimizadas para SEO y convierte los datos al formato requerido por Next.js para Static Site Generation (SSG).

## Uso Rápido

### Pipeline Completo (Recomendado)

```bash
cd promo-scraper
python ejecutar_pipeline_completo.py
```

Este script ejecuta automáticamente:
1. Scraping de todos los productos
2. Generación de contenido SEO único
3. Conversión a formato Next.js

## Archivos Generados

- `productos_avanzado.json` - Productos scrapeados
- `productos_con_seo.json` - Productos con SEO
- `products.json` - **Productos finales para Next.js**
- `categories.json` - **Categorías finales para Next.js**

## Build y Deploy

```bash
# 1. Ejecutar pipeline
python ejecutar_pipeline_completo.py

# 2. Build Next.js
cd ..
npm run build

# 3. Deploy
git push  # Si tienes Netlify conectado
```

## Características del Generador SEO

- Meta descripciones únicas para cada producto
- Keywords geográficas (Ecuador, Quito, Guayaquil)
- Templates múltiples con rotación aleatoria
- Detección inteligente de categorías
- 100% contenido único

Ver documentación completa en el archivo para más detalles.
