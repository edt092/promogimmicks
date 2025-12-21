import json
import os
import re

class MergeProductos:
    """Combina productos scrapeados con datos personalizados existentes"""

    def __init__(self):
        self.productos_scraped = []
        self.productos_existentes = []
        self.categorias_existentes = []
        self.productos_finales = []
        self.categoria_map = {
            # Mapeo de categorías scrapeadas a categorías existentes
            'articulos de escritura': 'articulos-escritura',
            'escritura': 'articulos-escritura',
            'boligrafos': 'articulos-escritura',
            'oficina': 'oficina',
            'libretas': 'oficina',
            'cuadernos': 'oficina',
            'tecnologia': 'tecnologia',
            'tech': 'tecnologia',
            'electronica': 'tecnologia',
            'mugs': 'mugs-vasos-termos',
            'tazas': 'mugs-vasos-termos',
            'vasos': 'mugs-vasos-termos',
            'termos': 'mugs-vasos-termos',
            'botilitos': 'mugs-vasos-termos',
            'llaveros': 'llaveros',
            'memorias usb': 'memorias-usb',
            'usb': 'memorias-usb',
            'hogar': 'hogar',
            'herramientas': 'herramientas',
            'pharma': 'pharma-cuidado-personal',
            'salud': 'pharma-cuidado-personal',
            'cuidado personal': 'pharma-cuidado-personal',
            'medicos': 'pharma-cuidado-personal',
            'variedades': 'variedades',
            'confecciones': 'variedades',
            'textil': 'variedades',
            'maletines': 'variedades',
            'bolsos': 'variedades',
            'deportes': 'variedades',
            'golf': 'variedades',
            'paraguas': 'variedades',
        }

    def cargar_datos(self):
        """Carga todos los datos necesarios"""
        data_dir = os.path.join(os.path.dirname(__file__), '..', 'data')

        # Cargar productos scrapeados
        scraped_path = os.path.join(data_dir, 'productos_scraped_completo.json')
        try:
            with open(scraped_path, 'r', encoding='utf-8') as f:
                self.productos_scraped = json.load(f)
            print(f"[OK] Cargados {len(self.productos_scraped)} productos scraped")
        except FileNotFoundError:
            print(f"[ERROR] No se encontro: {scraped_path}")
            return False

        # Cargar productos existentes
        existing_path = os.path.join(data_dir, 'products.json')
        try:
            with open(existing_path, 'r', encoding='utf-8') as f:
                self.productos_existentes = json.load(f)
            print(f"[OK] Cargados {len(self.productos_existentes)} productos existentes")
        except FileNotFoundError:
            print(f"[INFO] No hay productos existentes")
            self.productos_existentes = []

        # Cargar categorías existentes
        cats_path = os.path.join(data_dir, 'categories.json')
        try:
            with open(cats_path, 'r', encoding='utf-8') as f:
                self.categorias_existentes = json.load(f)
            print(f"[OK] Cargadas {len(self.categorias_existentes)} categorias existentes")
        except FileNotFoundError:
            print(f"[INFO] No hay categorias existentes")
            self.categorias_existentes = []

        return True

    def mapear_categoria(self, categoria_scrapeada):
        """Mapea categoría scrapeada a ID de categoría existente"""
        cat_lower = categoria_scrapeada.lower()

        # Buscar coincidencia directa
        for key, value in self.categoria_map.items():
            if key in cat_lower:
                return value

        # Si no encuentra, usar variedades como default
        return 'variedades'

    def generar_descripcion_seo(self, nombre, categoria):
        """Genera descripción SEO"""
        templates = [
            f"{nombre} personalizado con logo. Regalo promocional de alta calidad para empresas. Ideal para eventos corporativos, ferias y merchandising en Ecuador.",
            f"{nombre} para tu marca. Producto promocional personalizable con impresión de logo. Perfecto para regalos empresariales y campañas publicitarias en Ecuador.",
            f"Compra {nombre} personalizado con tu logo. Artículo promocional de calidad premium. Entrega rápida en Quito y todo Ecuador.",
        ]

        import random
        return random.choice(templates)

    def generar_story(self, nombre):
        """Genera story del producto"""
        return f"{nombre} combina calidad, diseño y funcionalidad. Cada detalle está pensado para que tu marca destaque y se mantenga presente en el día a día de tus clientes. La personalización de alta calidad garantiza que tu logo luzca impecable por mucho tiempo."

    def generar_features(self, nombre, categoria_id):
        """Genera features basadas en el tipo de producto"""
        features_base = [
            "Impresión de alta calidad",
            "Personalización con tu logo",
            "Múltiples opciones de personalización",
            "Materiales de calidad premium"
        ]

        features_especificas = {
            'articulos-escritura': ["Escritura suave y precisa", "Tinta de larga duración"],
            'memorias-usb': ["USB 2.0/3.0", "Capacidades desde 4GB"],
            'mugs-vasos-termos': ["Apto para lavavajillas", "Conservación de temperatura"],
            'llaveros': ["Resistente y duradero", "Diseño compacto"],
            'oficina': ["Papel de alta calidad", "Encuadernación resistente"],
            'tecnologia': ["Última tecnología", "Garantía de calidad"],
            'default': ["Diseño moderno", "Uso prolongado"]
        }

        especificas = features_especificas.get(categoria_id, features_especificas['default'])
        return (features_base + especificas)[:6]

    def generar_use_cases(self, categoria_id):
        """Genera casos de uso"""
        cases_map = {
            'articulos-escritura': ["Regalos corporativos", "Eventos empresariales", "Ferias comerciales", "Detalles ejecutivos"],
            'tecnologia': ["Eventos tech", "Regalos premium", "Campañas digitales", "Fidelización"],
            'oficina': ["Merchandising corporativo", "Onboarding empleados", "Material de oficina", "Eventos"],
            'default': ["Regalos corporativos", "Eventos de networking", "Ferias comerciales", "Campañas publicitarias"]
        }

        return cases_map.get(categoria_id, cases_map['default'])

    def buscar_producto_existente(self, nombre_scraped):
        """Busca si existe un producto similar en los datos existentes"""
        # Normalizar nombre para comparación
        nombre_norm = nombre_scraped.lower().strip()

        for producto in self.productos_existentes:
            nombre_exist = producto.get('name', '').lower().strip()

            # Comparación por similitud
            if nombre_norm == nombre_exist:
                return producto

            # Comparación por palabras clave
            palabras_scraped = set(nombre_norm.split())
            palabras_exist = set(nombre_exist.split())

            # Si comparten 70%+ de palabras, considerar match
            if len(palabras_scraped) > 2 and len(palabras_exist) > 2:
                interseccion = palabras_scraped & palabras_exist
                if len(interseccion) / max(len(palabras_scraped), len(palabras_exist)) > 0.7:
                    return producto

        return None

    def convertir_producto(self, producto_scraped):
        """Convierte un producto scrapeado al formato final"""

        # Buscar si existe un producto similar
        producto_existente = self.buscar_producto_existente(producto_scraped['nombre'])

        categoria_id = self.mapear_categoria(producto_scraped['categoria'])

        # Si existe, preservar datos personalizados
        if producto_existente:
            print(f"  [MATCH] {producto_scraped['nombre']} -> {producto_existente['name']}")

            producto_final = {
                **producto_existente,  # Copiar todo del existente
                'images': [producto_scraped['imagen_url']] if producto_scraped['imagen_url'] else producto_existente.get('images', [])
            }

            # Actualizar imagen si no tenía o si la scraped es mejor
            if not producto_final.get('images') or not producto_final['images']:
                producto_final['images'] = [producto_scraped['imagen_url']]

        else:
            # Producto nuevo, generar todo
            slug = producto_scraped['slug']
            nombre = producto_scraped['nombre']

            producto_final = {
                "id": producto_scraped['id'],
                "name": nombre,
                "slug": slug,
                "categoryId": categoria_id,
                "shortDescription": self.generar_descripcion_seo(nombre, producto_scraped['categoria']),
                "story": self.generar_story(nombre),
                "features": self.generar_features(nombre, categoria_id),
                "images": [producto_scraped['imagen_url']] if producto_scraped['imagen_url'] else [],
                "whatsappMessage": f"Hola! Me interesa el {nombre}. Podrian enviarme mas informacion sobre personalizacion y cantidades minimas?",
                "seoTitle": f"{nombre} Personalizado Ecuador | KS Promocionales",
                "seoDescription": self.generar_descripcion_seo(nombre, producto_scraped['categoria']),
                "useCases": self.generar_use_cases(categoria_id),
                "featured": False,
                "bestseller": False
            }

        return producto_final

    def procesar_todos(self):
        """Procesa todos los productos scrapeados"""
        print("\n" + "="*70)
        print("PROCESANDO PRODUCTOS")
        print("="*70)

        productos_nuevos = 0
        productos_actualizados = 0

        for producto in self.productos_scraped:
            try:
                producto_final = self.convertir_producto(producto)

                # Verificar si ya existe en productos finales
                existe = any(p['id'] == producto_final['id'] for p in self.productos_finales)

                if not existe:
                    self.productos_finales.append(producto_final)

                    # Contar si es nuevo o actualizado
                    if any(p['id'] == producto_final['id'] for p in self.productos_existentes):
                        productos_actualizados += 1
                    else:
                        productos_nuevos += 1

            except Exception as e:
                print(f"[ERROR] Procesando {producto.get('nombre', 'Unknown')}: {e}")

        print(f"\n[OK] Procesados {len(self.productos_finales)} productos")
        print(f"  - Nuevos: {productos_nuevos}")
        print(f"  - Actualizados: {productos_actualizados}")

    def guardar_resultados(self):
        """Guarda los productos finales"""
        data_dir = os.path.join(os.path.dirname(__file__), '..', 'data')
        output_path = os.path.join(data_dir, 'products_merged.json')

        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(self.productos_finales, f, ensure_ascii=False, indent=2)

        print(f"\n[OK] Productos guardados: {output_path}")
        print(f"[OK] Total: {len(self.productos_finales)} productos")

        # Estadísticas por categoría
        stats = {}
        for producto in self.productos_finales:
            cat = producto['categoryId']
            stats[cat] = stats.get(cat, 0) + 1

        print("\n--- PRODUCTOS POR CATEGORIA ---")
        for cat, count in sorted(stats.items(), key=lambda x: x[1], reverse=True):
            print(f"  {cat}: {count} productos")

    def ejecutar(self):
        """Ejecuta el proceso completo"""
        if not self.cargar_datos():
            return

        self.procesar_todos()
        self.guardar_resultados()


def main():
    """Función principal"""
    merger = MergeProductos()
    merger.ejecutar()


if __name__ == "__main__":
    main()
