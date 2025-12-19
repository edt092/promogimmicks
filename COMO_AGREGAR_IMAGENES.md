# Cómo Agregar Imágenes Reales a los Productos

## 📸 Estado Actual

Todos los productos usan un **placeholder genérico** (imagen temporal) porque el scraping automático de Marpico no funcionó debido a protecciones anti-bot del sitio.

## 🎯 Opciones para Obtener Imágenes

### Opción 1: Descargar Manualmente de Marpico (Recomendado)

1. Visita cada categoría en https://marpicopromocionales.com/#/portafolio
2. Haz clic derecho en las imágenes de productos
3. Guarda las imágenes con nombres descriptivos
4. Colócalas en `/public/img/productos/`

### Opción 2: Usar Imágenes de Stock

Puedes usar imágenes de bancos de imágenes gratuitos:
- https://unsplash.com (busca "promotional products")
- https://pexels.com
- https://pixabay.com

### Opción 3: Solicitar Catálogo a Marpico

Contacta a Marpico Promocionales y solicita:
- Catálogo digital con imágenes
- Acceso a su API (si tienen)
- Permiso para usar sus imágenes

## 📁 Estructura de Carpetas

```
public/
  img/
    productos/
      articulos-escritura/
        boligrafo-metalico-premium.jpg
        boligrafo-plastico-economico.jpg
        ...
      drinkware/
        mug-ceramica-11oz.jpg
        termo-acero-inoxidable.jpg
        ...
      tecnologia/
        usb-metalico-8gb.jpg
        power-bank-5000mah.jpg
        ...
      [etc...]
```

## ✏️ Actualizar el Archivo de Productos

Una vez que tengas las imágenes, edita `/data/products.json`:

```json
{
  "id": "producto-001",
  "nombre": "Bolígrafo Metálico Premium",
  "slug": "boligrafo-metalico-premium",
  "categoria": "Artículos de Escritura",
  "categoria_slug": "articulos-de-escritura",
  "descripcion_corta": "...",
  "imagen_url": "/img/productos/articulos-escritura/boligrafo-metalico-premium.jpg",
  "fuente": "Marpico Promocionales"
}
```

## 🚀 Script de Ayuda

Puedes usar este script Python para renombrar imágenes masivamente:

```python
import os
import json

# Cargar productos
with open('data/products.json', 'r', encoding='utf-8') as f:
    productos = json.load(f)

# Para cada producto
for producto in productos:
    slug = producto['slug']
    categoria_slug = producto['categoria_slug']

    # Ruta sugerida
    nueva_ruta = f"/img/productos/{categoria_slug}/{slug}.jpg"
    print(f"{producto['nombre']:50s} -> {nueva_ruta}")
```

## 📝 Formato Recomendado de Imágenes

- **Formato**: JPG o PNG
- **Tamaño**: 800x800px (cuadrado)
- **Peso**: Máximo 200KB por imagen
- **Fondo**: Blanco o transparente (PNG)

## 🔄 Actualización Masiva

Si tienes muchas imágenes, puedes usar este script:

```python
import json
import os

# Directorio de imágenes
img_dir = "public/img/productos"

# Cargar productos
with open('data/products.json', 'r', encoding='utf-8') as f:
    productos = json.load(f)

# Actualizar rutas
for producto in productos:
    categoria_slug = producto['categoria_slug']
    slug = producto['slug']

    # Buscar imagen
    posibles = [
        f"/img/productos/{categoria_slug}/{slug}.jpg",
        f"/img/productos/{categoria_slug}/{slug}.png",
        f"/img/productos/{slug}.jpg",
        f"/img/productos/{slug}.png",
    ]

    for ruta in posibles:
        if os.path.exists(f"public{ruta}"):
            producto['imagen_url'] = ruta
            break

# Guardar
with open('data/products.json', 'w', encoding='utf-8') as f:
    json.dump(productos, f, ensure_ascii=False, indent=2)

print("¡Rutas actualizadas!")
```

## 💡 Tips

1. **Nombres consistentes**: Usa el mismo `slug` del producto para nombrar la imagen
2. **Optimiza las imágenes**: Usa herramientas como TinyPNG para reducir el peso
3. **Backups**: Guarda un respaldo antes de hacer cambios masivos
4. **Prueba primero**: Actualiza 2-3 productos y verifica que funcione

## 🆘 Soporte

Si necesitas ayuda para:
- Automatizar la descarga de imágenes
- Renombrar archivos masivamente
- Optimizar imágenes

¡No dudes en preguntar!
