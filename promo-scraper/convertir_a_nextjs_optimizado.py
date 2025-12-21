"""
Convierte productos scrapeados con SEO al formato Next.js
Genera también el archivo de categorías optimizado
"""

import json
import os
from typing import Dict, List


class ConversorNextJS:
    """Convierte datos scrapeados al formato requerido por Next.js"""

    def __init__(self):
        self.categorias_map = {}
        self.productos_nextjs = []

    def mapear_categoria_a_id(self, categoria_nombre: str) -> str:
        """Mapea nombres de categorías y marcas a categorías principales"""
        categoria_lower = categoria_nombre.lower().strip()

        # Mapeo detallado: marcas, subcategorías → categorías principales
        mapeos = {
            # Escritura
            'escritura': ['boligrafo', 'lapiz', 'lapicero', 'pluma', 'marcador', 'resaltador',
                         'portaminas', 'estuches boligrafo', 'metalico', 'plastico', 'stylus',
                         'clip metalico', 'con resaltador'],

            # Mugs y Termos
            'mugs-vasos-termos': ['termo', 'mug', 'vaso', 'botilito', 'taza', 'jarra',
                                  'cantimplora', 'tritan', 'policarbonato', 'aislamiento',
                                  'ceramica', 'sublimacion', 'con destapador'],

            # Tecnología
            'tecnologia': ['usb', 'memoria', 'power bank', 'auricular', 'mouse', 'teclado',
                          'cable', 'hub', 'cargador', 'adaptador', 'speaker', 'parlante',
                          'bluetooth', 'smartphone', 'tablet', 'computador', 'boompods',
                          'esterilizador', 'organizadores de cables', 'ventilador'],

            # Bolsos y Mochilas
            'bolsos-mochilas': ['bolso', 'mochila', 'morral', 'backpack', 'maleta', 'neceser',
                               'portafolio', 'cartera', 'tote', 'canguro', 'ejecutivo',
                               'deportivo', 'nevera', 'cooler', 'trolley', 'organizadores de viaje',
                               'algodon', 'cambrel', 'poliester', 'tula', 'yute'],

            # Oficina
            'oficina': ['cuaderno', 'agenda', 'carpeta', 'archivador', 'portadocumento',
                       'escritorio', 'organizador', 'libreta', 'memo', 'mouse-pad',
                       'portalapices', 'sticky', 'tarjetero', 'portafolio', 'portamensaje'],

            # Hogar
            'hogar': ['cocina', 'hogar', 'vino', 'bar', 'contenedor', 'portacomida',
                     'destapador', 'bbq', 'queso', 'reloj', 'foto', 'marco', 'silla',
                     'cobija', 'portaretrato', 'pared', 'mesa'],

            # Herramientas
            'herramientas': ['herramienta', 'destornillador', 'martillo', 'kit', 'multiuso',
                            'navaja', 'linterna', 'metro', 'set herramienta'],

            # Textiles
            'textiles': ['camiseta', 'polo', 'gorra', 'chaleco', 'chaqueta', 'sudadera',
                        'bufanda', 'delantal', 'toalla', 'impermeable', 'poncho'],

            # Pharma y Cuidado Personal
            'pharma-cuidado-personal': ['tapabocas', 'mascarilla', 'gel', 'desinfectante',
                                       'antibacterial', 'kit medico', 'pharma', 'belleza',
                                       'masajeador', 'pastillero'],

            # Llaveros
            'llaveros': ['llavero', 'llave', 'keychain'],

            # Ecológicos
            'ecologicos': ['ecologico', 'reciclado', 'biodegradable', 'bambu', 'bamboo',
                          'eco', 'wheat', 'trigo', 'rpet'],

            # Paraguas
            'paraguas': ['paraguas', 'sombrilla', 'mini 21', 'normales 23'],

            # Juguetes y Variedades
            'variedades': ['alcancia', 'colores', 'estuche', 'monedero', 'festejo',
                          'antiestres', 'gafa', 'candado', 'billetera', 'pulso',
                          'pito', 'moptop', 'portapasaporte', 'portacartera'],

            # Automóvil
            'accesorios-auto': ['automovil', 'auto', 'rastal'],

            # Novedades (productos nuevos)
            'novedades': ['novedades', 'nuevo'],
        }

        # Buscar en los mapeos
        for categoria_id, keywords in mapeos.items():
            if any(keyword in categoria_lower for keyword in keywords):
                return categoria_id

        # Marcas específicas se mapean a categorías según contexto
        # Chili, Xindao, etc. son marcas que venden varios tipos de productos
        # Las dejamos como variedades si no matchean ninguna categoría específica
        return 'variedades'

    def obtener_nombre_categoria_display(self, categoria_id: str) -> str:
        """Retorna el nombre descriptivo en español para cada categoría"""
        nombres = {
            'escritura': 'Artículos de Escritura',
            'mugs-vasos-termos': 'Mugs, Vasos y Termos',
            'tecnologia': 'Tecnología',
            'bolsos-mochilas': 'Bolsos y Mochilas',
            'oficina': 'Artículos de Oficina',
            'hogar': 'Hogar y Cocina',
            'herramientas': 'Herramientas',
            'textiles': 'Textiles',
            'pharma-cuidado-personal': 'Cuidado Personal',
            'llaveros': 'Llaveros',
            'ecologicos': 'Productos Ecológicos',
            'paraguas': 'Paraguas',
            'variedades': 'Variedades',
            'accesorios-auto': 'Accesorios para Auto',
            'novedades': 'Novedades',
        }
        return nombres.get(categoria_id, categoria_id.replace('-', ' ').title())

    def generar_categorias_json(self, productos: List[Dict]) -> List[Dict]:
        """Genera archivo de categorías con imágenes de productos destacados"""
        categorias_productos = {}

        # Agrupar productos por categoría
        for producto in productos:
            categoria_id = self.mapear_categoria_a_id(producto.get('categoria', 'Variedades'))

            if categoria_id not in categorias_productos:
                categorias_productos[categoria_id] = []

            categorias_productos[categoria_id].append(producto)

        # Crear categorías con imagen del producto destacado
        categorias = []
        for categoria_id, productos_cat in categorias_productos.items():
            nombre_display = self.obtener_nombre_categoria_display(categoria_id)

            # Obtener imagen del primer producto con imagen
            imagen = ''
            for prod in productos_cat:
                if prod.get('imagen_url'):
                    imagen = prod['imagen_url']
                    break

            # Generar títulos y descripciones optimizados (max 60 y 155 caracteres)
            seo_title = f"{nombre_display} Ecuador | KS"
            if len(seo_title) > 60:
                seo_title = f"{nombre_display[:40]}... | KS"

            seo_desc = f"{nombre_display} personalizados con logo. Alta calidad. Envíos en Ecuador. ¡Cotiza por WhatsApp!"
            if len(seo_desc) > 155:
                seo_desc = f"{nombre_display} con logo. Calidad garantizada. ¡Cotiza por WhatsApp!"

            categoria = {
                'id': categoria_id,
                'name': nombre_display,
                'slug': categoria_id,
                'description': f"Descubre {nombre_display.lower()} personalizados con tu logo. Alta calidad y entrega rápida en Ecuador.",
                'icon': self.asignar_icono(categoria_id),
                'story': f"Ofrecemos {nombre_display.lower()} promocionales de calidad premium, diseñados para que tu marca destaque. Personalización profesional garantizada.",
                'seoTitle': seo_title,
                'seoDescription': seo_desc,
                'benefits': [
                    'Personalización con tu logo',
                    'Alta calidad garantizada',
                    'Envíos en Ecuador',
                    'Precios competitivos'
                ],
                'image': imagen,
                'productCount': len(productos_cat)
            }

            categorias.append(categoria)

        # Ordenar por cantidad de productos (descendente)
        categorias.sort(key=lambda x: x['productCount'], reverse=True)

        return categorias

    def asignar_icono(self, categoria_id: str) -> str:
        """Asigna un ícono apropiado para cada categoría"""
        iconos = {
            'textiles': 'Shirt',
            'escritura': 'PenTool',
            'tecnologia': 'Laptop',
            'hogar': 'Home',
            'oficina': 'Briefcase',
            'mugs-vasos-termos': 'Coffee',
            'llaveros': 'Key',
            'bolsos-mochilas': 'Backpack',
            'paraguas': 'Umbrella',
            'herramientas': 'Wrench',
            'deportes-aire-libre': 'Activity',
            'pharma-cuidado-personal': 'Heart',
            'ecologicos': 'Leaf',
            'memorias-usb': 'HardDrive',
            'relojes-joyeria': 'Watch',
            'juguetes-infantiles': 'Baby',
            'mascotas': 'PawPrint',
            'accesorios-auto': 'Car',
            'novedades': 'Sparkles',
        }

        return iconos.get(categoria_id, 'Package')

    def convertir_producto(self, producto: Dict, index: int) -> Dict:
        """Convierte un producto al formato Next.js"""
        categoria_id = self.mapear_categoria_a_id(producto.get('categoria', 'Variedades'))

        # Generar mensaje de WhatsApp personalizado
        whatsapp_msg = f"Hola! Me interesa el {producto.get('nombre', '')}. ¿Podrían enviarme más información sobre personalización y cantidades mínimas?"

        producto_nextjs = {
            'id': producto.get('id', f'producto-{index}'),
            'name': producto.get('nombre', ''),
            'slug': producto.get('slug', ''),
            'categoryId': categoria_id,
            'shortDescription': producto.get('shortDescription', ''),
            'story': producto.get('story', ''),
            'features': producto.get('features', []),
            'images': [producto.get('imagen_url', '')] if producto.get('imagen_url') else [],
            'whatsappMessage': whatsapp_msg,
            'seoTitle': producto.get('seoTitle', ''),
            'seoDescription': producto.get('seoDescription', ''),
            'keywords': producto.get('keywords', ''),
            'useCases': producto.get('useCases', []),
            'featured': index < 10,  # Los primeros 10 productos son destacados
            'bestseller': False
        }

        return producto_nextjs

    def procesar_archivo(self, input_file: str, output_products: str, output_categories: str):
        """Procesa el archivo de entrada y genera los archivos de salida"""
        print(f"\n[INFO] Convirtiendo a formato Next.js...")
        print(f"[INFO] Archivo de entrada: {input_file}")

        try:
            with open(input_file, 'r', encoding='utf-8') as f:
                productos = json.load(f)

            print(f"[OK] Cargados {len(productos)} productos")

            # Convertir productos
            productos_nextjs = []
            for idx, producto in enumerate(productos, 1):
                if idx % 200 == 0:
                    print(f"  Procesados {idx}/{len(productos)}")

                producto_nextjs = self.convertir_producto(producto, idx)
                productos_nextjs.append(producto_nextjs)

            # Generar categorías
            categorias = self.generar_categorias_json(productos)

            # Guardar productos
            with open(output_products, 'w', encoding='utf-8') as f:
                json.dump(productos_nextjs, f, ensure_ascii=False, indent=2)

            print(f"\n[OK] Productos guardados: {output_products}")
            print(f"[OK] Total productos: {len(productos_nextjs)}")

            # Guardar categorías
            with open(output_categories, 'w', encoding='utf-8') as f:
                json.dump(categorias, f, ensure_ascii=False, indent=2)

            print(f"[OK] Categorías guardadas: {output_categories}")
            print(f"[OK] Total categorías: {len(categorias)}")

            # Estadísticas
            print("\n--- ESTADÍSTICAS ---")
            print(f"Productos con imágenes: {sum(1 for p in productos_nextjs if p['images'])}")
            print(f"Productos destacados: {sum(1 for p in productos_nextjs if p['featured'])}")

            # Productos por categoría
            cat_count = {}
            for p in productos_nextjs:
                cat_id = p['categoryId']
                cat_count[cat_id] = cat_count.get(cat_id, 0) + 1

            print("\nProductos por categoría:")
            for cat_id, count in sorted(cat_count.items(), key=lambda x: x[1], reverse=True):
                cat_name = next((c['name'] for c in categorias if c['id'] == cat_id), cat_id)
                print(f"  {cat_name}: {count}")

            # Muestra
            print("\n--- MUESTRA DE PRODUCTO FINAL ---")
            if productos_nextjs:
                p = productos_nextjs[0]
                print(json.dumps(p, indent=2, ensure_ascii=False)[:800])
                print("...")

        except Exception as e:
            print(f"[ERROR] {e}")
            import traceback
            traceback.print_exc()


def main():
    """Función principal"""
    script_dir = os.path.dirname(__file__)
    data_dir = os.path.join(script_dir, '..', 'data')

    # Archivos de entrada/salida
    input_file = os.path.join(data_dir, 'productos_con_seo.json')
    output_products = os.path.join(data_dir, 'products.json')
    output_categories = os.path.join(data_dir, 'categories.json')

    if not os.path.exists(input_file):
        print(f"[ERROR] No se encontró: {input_file}")
        print("[INFO] Ejecuta primero: generador_seo_avanzado.py")
        return

    conversor = ConversorNextJS()
    conversor.procesar_archivo(input_file, output_products, output_categories)

    print("\n" + "="*70)
    print("CONVERSIÓN COMPLETADA")
    print("="*70)
    print(f"\nArchivos generados:")
    print(f"  - {output_products}")
    print(f"  - {output_categories}")
    print("\nAhora puedes ejecutar: npm run build")
    print("="*70 + "\n")


if __name__ == "__main__":
    main()
