import json
import os
import re

class ConversorNextJS:
    """Convierte datos scrapeados al formato de Next.js"""

    def __init__(self, input_file='productos_scraped.json'):
        self.input_file = input_file
        self.productos_scraped = []
        self.productos_nextjs = []
        self.categorias_map = {}

    def cargar_datos(self):
        """Carga los datos scrapeados"""
        data_dir = os.path.join(os.path.dirname(__file__), '..', 'data')
        input_path = os.path.join(data_dir, self.input_file)

        try:
            with open(input_path, 'r', encoding='utf-8') as f:
                self.productos_scraped = json.load(f)
            print(f"✓ Cargados {len(self.productos_scraped)} productos")
            return True
        except FileNotFoundError:
            print(f"✗ Error: No se encontró {input_path}")
            return False

    def generar_features(self, nombre, categoria):
        """Genera características del producto basadas en su tipo"""
        features_base = [
            "Impresión de alta calidad",
            "Personalización con tu logo",
            "Múltiples opciones de personalización",
            "Materiales de calidad premium"
        ]

        # Features específicas por tipo de producto
        features_especificas = {
            'boligrafo': ["Escritura suave y precisa", "Tinta de larga duración"],
            'lapiz': ["Mina resistente", "Ergonómico"],
            'memoria': ["USB 2.0/3.0", "Capacidades desde 4GB"],
            'mug': ["Apto para lavavajillas", "Conservación de temperatura"],
            'termo': ["Doble pared térmica", "Libre de BPA"],
            'llavero': ["Resistente y duradero", "Diseño compacto"],
            'libreta': ["Papel de alta calidad", "Encuadernación resistente"],
            'default': ["Diseño moderno", "Uso prolongado"]
        }

        # Detectar tipo de producto
        nombre_lower = nombre.lower()
        tipo = 'default'
        for key in features_especificas.keys():
            if key in nombre_lower or key in categoria.lower():
                tipo = key
                break

        features = features_base + features_especificas.get(tipo, features_especificas['default'])
        return features[:6]

    def generar_use_cases(self, categoria):
        """Genera casos de uso según la categoría"""
        cases_map = {
            'escritura': ["Regalos corporativos", "Eventos empresariales", "Ferias comerciales", "Detalles ejecutivos"],
            'tecnologia': ["Eventos tech", "Regalos premium", "Campañas digitales", "Fidelización"],
            'hogar': ["Regalos corporativos", "Aniversarios empresariales", "Reconocimientos", "Eventos especiales"],
            'oficina': ["Merchandising corporativo", "Onboarding empleados", "Material de oficina", "Eventos"],
            'default': ["Regalos corporativos", "Eventos de networking", "Ferias comerciales", "Campañas publicitarias"]
        }

        categoria_lower = categoria.lower()
        for key in cases_map.keys():
            if key in categoria_lower:
                return cases_map[key]

        return cases_map['default']

    def generar_story(self, nombre):
        """Genera una historia de marca para el producto"""
        stories = [
            f"{nombre} combina calidad, diseño y funcionalidad. Cada detalle está pensado para que tu marca destaque y se mantenga presente en el día a día de tus clientes. La personalización de alta calidad garantiza que tu logo luzca impecable por mucho tiempo.",
            f"Con {nombre}, tu marca cobra vida. Un producto promocional que combina elegancia y utilidad, diseñado para crear conexiones duraderas con tus clientes. Cada pieza es una oportunidad para fortalecer tu presencia en el mercado.",
            f"{nombre} representa la excelencia en productos promocionales. Fabricado con los más altos estándares de calidad, este artículo lleva tu marca a donde tus clientes van. Una inversión en visibilidad que perdura en el tiempo.",
        ]

        import random
        return random.choice(stories)

    def mapear_categoria_id(self, categoria_nombre):
        """Mapea nombres de categorías a IDs consistentes"""
        # Categorías estándar
        categorias_standard = {
            'articulos de escritura': 'articulos-escritura',
            'escritura': 'articulos-escritura',
            'boligrafos': 'articulos-escritura',
            'tecnologia': 'tecnologia',
            'tech': 'tecnologia',
            'electronica': 'tecnologia',
            'memorias usb': 'memorias-usb',
            'usb': 'memorias-usb',
            'mugs': 'mugs-vasos-termos',
            'tazas': 'mugs-vasos-termos',
            'vasos': 'mugs-vasos-termos',
            'termos': 'mugs-vasos-termos',
            'drinkware': 'mugs-vasos-termos',
            'llaveros': 'llaveros',
            'oficina': 'oficina',
            'libretas': 'oficina',
            'cuadernos': 'oficina',
            'hogar': 'hogar',
            'herramientas': 'herramientas',
            'pharma': 'pharma-cuidado-personal',
            'salud': 'pharma-cuidado-personal',
            'variedades': 'variedades',
        }

        categoria_lower = categoria_nombre.lower()

        for key, value in categorias_standard.items():
            if key in categoria_lower:
                return value

        # Si no encuentra match, genera un slug
        return re.sub(r'[^a-z0-9]+', '-', categoria_lower).strip('-')

    def convertir_producto(self, producto_scraped):
        """Convierte un producto scrapeado al formato Next.js"""

        categoria_id = self.mapear_categoria_id(producto_scraped['categoria'])

        # Agregar categoría al map
        if categoria_id not in self.categorias_map:
            self.categorias_map[categoria_id] = producto_scraped['categoria']

        producto_nextjs = {
            "id": producto_scraped['id'],
            "name": producto_scraped['nombre'],
            "slug": producto_scraped['slug'],
            "categoryId": categoria_id,
            "shortDescription": producto_scraped['descripcion'],
            "story": self.generar_story(producto_scraped['nombre']),
            "features": self.generar_features(producto_scraped['nombre'], producto_scraped['categoria']),
            "images": [
                producto_scraped['imagen_url']
            ] if producto_scraped['imagen_url'] else [],
            "whatsappMessage": f"Hola! Me interesa el {producto_scraped['nombre']}. ¿Podrían enviarme más información sobre personalización y cantidades mínimas?",
            "seoTitle": producto_scraped['seo_title'],
            "seoDescription": producto_scraped['seo_description'],
            "useCases": self.generar_use_cases(producto_scraped['categoria']),
            "featured": False,
            "bestseller": False
        }

        return producto_nextjs

    def convertir_todos(self):
        """Convierte todos los productos"""
        print("\nConvirtiendo productos al formato Next.js...")

        for producto in self.productos_scraped:
            try:
                producto_convertido = self.convertir_producto(producto)
                self.productos_nextjs.append(producto_convertido)
            except Exception as e:
                print(f"✗ Error al convertir {producto.get('nombre', 'Unknown')}: {e}")

        print(f"✓ {len(self.productos_nextjs)} productos convertidos")

    def guardar_productos(self, output_file='products_generated.json'):
        """Guarda los productos en formato Next.js"""
        data_dir = os.path.join(os.path.dirname(__file__), '..', 'data')
        output_path = os.path.join(data_dir, output_file)

        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(self.productos_nextjs, f, ensure_ascii=False, indent=2)

        print(f"✓ Productos guardados en: {output_path}")

    def generar_categorias(self, output_file='categories_generated.json'):
        """Genera el archivo de categorías basado en los productos"""
        data_dir = os.path.join(os.path.dirname(__file__), '..', 'data')
        output_path = os.path.join(data_dir, output_file)

        categorias = []
        for cat_id, cat_nombre in self.categorias_map.items():
            # Contar productos en esta categoría
            productos_count = sum(1 for p in self.productos_nextjs if p['categoryId'] == cat_id)

            categoria = {
                "id": cat_id,
                "name": cat_nombre,
                "slug": cat_id,
                "description": f"{cat_nombre} personalizados con tu logo para empresas y eventos",
                "image": "/images/placeholder-category.jpg",
                "color": "#4A90E2",
                "seoTitle": f"{cat_nombre} Personalizados Ecuador | KS Promocionales",
                "seoDescription": f"Catálogo de {cat_nombre.lower()} personalizados para empresas. Regalos promocionales de alta calidad con entrega en Ecuador.",
                "story": f"Descubre nuestra colección de {cat_nombre.lower()} para tu marca",
                "benefits": [
                    "Personalización premium",
                    "Calidad garantizada",
                    "Entrega rápida",
                    "Desde cantidades mínimas"
                ],
                "productCount": productos_count
            }
            categorias.append(categoria)

        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(categorias, f, ensure_ascii=False, indent=2)

        print(f"✓ Categorías generadas en: {output_path}")
        print(f"✓ Total categorías: {len(categorias)}")

    def mostrar_resumen(self):
        """Muestra un resumen de la conversión"""
        print("\n" + "="*60)
        print("RESUMEN DE CONVERSIÓN")
        print("="*60)
        print(f"Productos convertidos: {len(self.productos_nextjs)}")
        print(f"Categorías encontradas: {len(self.categorias_map)}")

        print("\nCategorías:")
        for cat_id, cat_nombre in sorted(self.categorias_map.items()):
            count = sum(1 for p in self.productos_nextjs if p['categoryId'] == cat_id)
            print(f"  • {cat_nombre}: {count} productos")

        print("\n" + "="*60 + "\n")

    def ejecutar(self):
        """Ejecuta el proceso completo de conversión"""
        if not self.cargar_datos():
            return

        self.convertir_todos()
        self.guardar_productos()
        self.generar_categorias()
        self.mostrar_resumen()


def main():
    """Función principal"""
    conversor = ConversorNextJS(input_file='productos_scraped.json')
    conversor.ejecutar()


if __name__ == "__main__":
    main()
