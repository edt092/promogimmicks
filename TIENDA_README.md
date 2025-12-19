# Tienda PromoGimmicks

## ✅ Implementación Completada

Se ha creado exitosamente una tienda de productos promocionales para PromoGimmicks con las siguientes características:

### 📁 Archivos Creados

1. **`/app/tienda/page.tsx`** - Página principal de la tienda
2. **`/components/TiendaGrid.tsx`** - Grid de productos con filtros y búsqueda
3. **`/components/ProductCard.tsx`** - Tarjeta individual de producto
4. **`/data/products.json`** - Base de datos de productos (12 productos de muestra)
5. **`/components/Navbar.tsx`** - Actualizado con enlace a la tienda

### 🎨 Características de la Tienda

- **Búsqueda en tiempo real** - Los usuarios pueden buscar productos por nombre o descripción
- **Filtros por categoría** - Navegación fácil por categorías de productos
- **Cards responsivas** - Diseño adaptable a todos los dispositivos
- **Botón de cotización** - Cada producto tiene un botón que abre WhatsApp para cotizar
- **Imágenes con fallback** - Si una imagen no carga, se muestra un placeholder
- **Contador de resultados** - Muestra cuántos productos coinciden con los filtros

### 🗂️ Categorías Actuales

- Artículos de Escritura
- Drinkware
- Textil y Vestuario
- Tecnología
- Bolsos y Mochilas
- Accesorios

### 🔗 Navegación

La tienda está accesible desde:
- Menú principal: **Tienda**
- URL directa: `http://localhost:3000/tienda`

## 📝 Cómo Actualizar los Productos

### Opción 1: Editar Manualmente (Recomendado)

Edita el archivo `/data/products.json` con tus productos reales:

```json
{
  "id": "producto-unico",
  "nombre": "Nombre del Producto",
  "slug": "nombre-del-producto",
  "categoria": "Categoría",
  "categoria_slug": "categoria",
  "descripcion_corta": "Descripción breve del producto",
  "imagen_url": "/ruta/a/imagen.jpg",
  "precio": 10.50,
  "fuente": "Marpico Promocionales"
}
```

### Opción 2: Usar el Scraper (Avanzado)

Se creó un scraper para marpicopromocionales.com en `/promo-scraper/scraper_marpico.py`, pero el sitio usa Angular y carga contenido dinámicamente, lo que hace el scraping complejo.

**Para usar el scraper:**

```bash
cd promo-scraper
python scraper_marpico.py
```

**Nota:** El scraper puede requerir ajustes en los selectores CSS debido a la naturaleza dinámica del sitio.

### Opción 3: Importar desde CSV/Excel

Puedes crear un script para convertir datos de CSV/Excel a JSON:

```python
import json
import csv

productos = []
with open('productos.csv', 'r', encoding='utf-8') as file:
    reader = csv.DictReader(file)
    for row in reader:
        productos.append({
            "id": row['id'],
            "nombre": row['nombre'],
            # ... más campos
        })

with open('../data/products.json', 'w', encoding='utf-8') as f:
    json.dump(productos, f, ensure_ascii=False, indent=2)
```

## 🎨 Personalización

### Cambiar el Número de WhatsApp

Edita `/components/ProductCard.tsx`, línea 25:

```typescript
const whatsappUrl = `https://wa.me/TU_NUMERO?text=${encodeURIComponent(mensaje)}`;
```

### Cambiar Colores

Los colores principales de la tienda son:
- **Azul Oscuro**: `blue-900` (RGB: 30, 58, 138)
- **Amarillo/Ámbar**: `amber-500` (RGB: 245, 158, 11)

### Agregar Más Campos

Si quieres agregar campos como "stock", "SKU", etc., actualiza:

1. El archivo `products.json`
2. La interfaz `Product` en `ProductCard.tsx`
3. El componente `ProductCard` para mostrar los nuevos campos

## 🚀 Siguientes Pasos

1. **Agregar productos reales** - Reemplaza los productos de muestra con tu catálogo
2. **Agregar imágenes** - Sube imágenes de productos a `/public/img/productos/`
3. **Configurar WhatsApp** - Actualiza el número de WhatsApp
4. **SEO** - Optimiza títulos y descripciones de productos
5. **Analytics** - Agrega Google Analytics para rastrear visitas

## 📱 Responsive Design

La tienda está optimizada para:
- **Mobile** (1 columna)
- **Tablet** (2 columnas)
- **Desktop** (3-4 columnas)

## 🐛 Troubleshooting

### Las imágenes no se muestran

- Verifica que las rutas sean correctas
- Asegúrate de que las imágenes estén en `/public/`
- El componente tiene un fallback automático

### Los filtros no funcionan

- Verifica que los productos tengan los campos `nombre`, `descripcion_corta` y `categoria`
- Revisa la consola del navegador para errores

## 📞 Soporte

Si necesitas ayuda para:
- Scrapear datos de otro sitio
- Agregar funcionalidades adicionales
- Optimizar el rendimiento

¡No dudes en preguntar!

---

**Última actualización:** Diciembre 2024
**Versión:** 1.0.0
