import requests
from bs4 import BeautifulSoup
import json
import time
import re
from urllib.parse import urljoin, urlparse
import os

class SubcategoriaScraper:
    def __init__(self, base_url="https://www.catalogospromocionales.com/seccion/subcategorias.html"):
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
        self.subcategorias = []
        self.productos = []

    def get_page(self, url):
        """Obtiene el contenido de una URL"""
        try:
            response = self.session.get(url, timeout=15)
            response.raise_for_status()
            return response.text
        except requests.RequestException as e:
            print(f"Error al obtener {url}: {e}")
            return None

    def extract_subcategorias(self):
        """Extrae todas las subcategorías de la página principal"""
        print("Extrayendo subcategorías...")
        html = self.get_page(self.base_url)
        if not html:
            return []

        soup = BeautifulSoup(html, 'lxml')

        # Buscar enlaces a subcategorías
        # Patrón: enlaces que contienen /seccion/ en la URL
        links = soup.find_all('a', href=True)

        subcategorias_set = set()
        for link in links:
            href = link.get('href', '')
            if '/seccion/' in href and href != '/seccion/subcategorias.html':
                full_url = urljoin(self.base_url, href)
                nombre = link.get_text(strip=True)
                if nombre and len(nombre) > 2:
                    subcategorias_set.add((nombre, full_url))

        self.subcategorias = list(subcategorias_set)
        print(f"[OK] Encontradas {len(self.subcategorias)} subcategorias")
        return self.subcategorias

    def generar_slug(self, texto):
        """Genera un slug SEO-friendly"""
        texto = texto.lower()
        texto = re.sub(r'[áàâä]', 'a', texto)
        texto = re.sub(r'[éèêë]', 'e', texto)
        texto = re.sub(r'[íìîï]', 'i', texto)
        texto = re.sub(r'[óòôö]', 'o', texto)
        texto = re.sub(r'[úùûü]', 'u', texto)
        texto = re.sub(r'[ñ]', 'n', texto)
        texto = re.sub(r'[^a-z0-9\s-]', '', texto)
        texto = re.sub(r'\s+', '-', texto)
        texto = re.sub(r'-+', '-', texto)
        return texto.strip('-')

    def generar_descripcion_seo(self, nombre_producto, categoria):
        """Genera una descripción optimizada con keywords"""
        templates = [
            f"{nombre_producto} personalizado con logo. Regalo promocional de alta calidad para empresas. Ideal para eventos corporativos, ferias y merchandising en Ecuador.",
            f"{nombre_producto} para tu marca. Producto promocional personalizable con impresión de logo. Perfecto para regalos empresariales y campañas publicitarias.",
            f"Compra {nombre_producto} personalizado. Artículo promocional de calidad premium con tu logo. Entrega rápida en Quito y todo Ecuador.",
            f"{nombre_producto} promocional personalizado. Regalo corporativo ideal para eventos, ferias y activaciones de marca. Alta calidad y personalización garantizada.",
        ]

        import random
        return random.choice(templates)

    def generar_nombre_optimizado(self, nombre_base):
        """Optimiza el nombre del producto con keywords relevantes"""
        # Limpiar el nombre
        nombre = nombre_base.strip()

        # Eliminar códigos de referencia entre paréntesis
        nombre = re.sub(r'\([^)]*\)', '', nombre)
        nombre = re.sub(r'\[[^\]]*\]', '', nombre)

        # Limpiar espacios múltiples
        nombre = re.sub(r'\s+', ' ', nombre).strip()

        # Capitalizar correctamente
        palabras = nombre.split()
        nombre_optimizado = ' '.join([
            palabra.capitalize() if len(palabra) > 3 else palabra.lower()
            for palabra in palabras
        ])

        return nombre_optimizado

    def extraer_productos_categoria(self, categoria_nombre, categoria_url, max_productos=50):
        """Extrae productos de una categoría específica"""
        print(f"\n  -> Extrayendo productos de '{categoria_nombre}'...")

        html = self.get_page(categoria_url)
        if not html:
            return []

        soup = BeautifulSoup(html, 'lxml')
        productos_encontrados = []

        # Buscar productos en la página
        # Patrón común: div con clase que contiene producto, item, etc.
        product_containers = soup.find_all(['div', 'article', 'li'], class_=re.compile(r'product|item|card', re.I))

        if not product_containers:
            # Intentar otro patrón: divs que contienen enlaces a productos
            product_containers = soup.find_all('div', recursive=True)

        seen_products = set()

        for container in product_containers[:max_productos]:
            try:
                # Buscar enlace al producto
                link = container.find('a', href=re.compile(r'/p/|producto|item'))
                if not link:
                    continue

                producto_url = urljoin(categoria_url, link.get('href', ''))

                # Evitar duplicados
                if producto_url in seen_products:
                    continue
                seen_products.add(producto_url)

                # Extraer nombre
                nombre = None
                # Buscar en diferentes lugares
                for tag in ['h2', 'h3', 'h4', 'p', 'span', 'a']:
                    element = container.find(tag, class_=re.compile(r'title|name|nombre|product', re.I))
                    if element:
                        nombre = element.get_text(strip=True)
                        break

                if not nombre:
                    nombre = link.get_text(strip=True)

                if not nombre or len(nombre) < 3:
                    continue

                # Extraer imagen
                img = container.find('img')
                imagen_url = ''
                if img:
                    imagen_url = urljoin(categoria_url, img.get('src') or img.get('data-src', ''))

                # Generar datos optimizados
                nombre_optimizado = self.generar_nombre_optimizado(nombre)
                slug = self.generar_slug(nombre_optimizado)
                descripcion_seo = self.generar_descripcion_seo(nombre_optimizado, categoria_nombre)

                # Generar ID único
                producto_id = self.generar_slug(f"{categoria_nombre}-{nombre_optimizado}")[:50]

                producto = {
                    'id': producto_id,
                    'nombre': nombre_optimizado,
                    'slug': slug,
                    'categoria': categoria_nombre,
                    'categoria_slug': self.generar_slug(categoria_nombre),
                    'descripcion': descripcion_seo,
                    'imagen_url': imagen_url,
                    'producto_url': producto_url,
                    'seo_title': f"{nombre_optimizado} Personalizado Ecuador | KS Promocionales",
                    'seo_description': descripcion_seo,
                    'keywords': self.generar_keywords(nombre_optimizado, categoria_nombre)
                }

                productos_encontrados.append(producto)

            except Exception as e:
                continue

        print(f"    [OK] {len(productos_encontrados)} productos extraidos")
        return productos_encontrados

    def generar_keywords(self, nombre, categoria):
        """Genera keywords relevantes para SEO"""
        keywords = [
            nombre.lower(),
            f"{nombre.lower()} personalizado",
            f"{nombre.lower()} promocional",
            f"{nombre.lower()} ecuador",
            categoria.lower(),
            "regalo corporativo",
            "articulo promocional",
            "merchandising"
        ]
        return ', '.join(keywords[:8])

    def scrapear_todo(self, max_categorias=None, max_productos_por_cat=50, delay=2):
        """Ejecuta el scraping completo"""
        print("\n" + "="*60)
        print("INICIANDO SCRAPING DE SUBCATEGORÍAS")
        print("="*60)

        # Extraer subcategorías
        subcategorias = self.extract_subcategorias()

        if max_categorias:
            subcategorias = subcategorias[:max_categorias]

        print(f"\nProcesando {len(subcategorias)} categorías...\n")

        # Procesar cada categoría
        for idx, (nombre, url) in enumerate(subcategorias, 1):
            print(f"[{idx}/{len(subcategorias)}] {nombre}")
            productos = self.extraer_productos_categoria(nombre, url, max_productos_por_cat)
            self.productos.extend(productos)

            # Delay entre categorías
            if idx < len(subcategorias):
                time.sleep(delay)

        print("\n" + "="*60)
        print(f"SCRAPING COMPLETADO")
        print(f"Total productos extraídos: {len(self.productos)}")
        print("="*60 + "\n")

    def guardar_json(self, filename='productos_scraped.json'):
        """Guarda los productos en formato JSON"""
        if not self.productos:
            print("[WARNING] No hay productos para guardar")
            return

        # Crear directorio si no existe
        output_dir = os.path.join(os.path.dirname(__file__), '..', 'data')
        os.makedirs(output_dir, exist_ok=True)

        output_path = os.path.join(output_dir, filename)

        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(self.productos, f, ensure_ascii=False, indent=2)

        print(f"[OK] Datos guardados en: {output_path}")
        print(f"[OK] Total productos: {len(self.productos)}")

        # Estadisticas
        categorias = set(p['categoria'] for p in self.productos)
        print(f"[OK] Categorias unicas: {len(categorias)}")

        # Mostrar muestra
        print("\n--- MUESTRA DE PRODUCTOS ---")
        for producto in self.productos[:3]:
            print(f"\n* {producto['nombre']}")
            print(f"  Categoria: {producto['categoria']}")
            print(f"  Descripcion: {producto['descripcion'][:80]}...")
            print(f"  Keywords: {producto['keywords'][:60]}...")


def main():
    """Función principal"""
    scraper = SubcategoriaScraper()

    # Configuración
    MAX_CATEGORIAS = None  # None = todas las categorías
    MAX_PRODUCTOS_POR_CATEGORIA = 100
    DELAY_ENTRE_CATEGORIAS = 2  # segundos

    # Ejecutar scraping
    scraper.scrapear_todo(
        max_categorias=MAX_CATEGORIAS,
        max_productos_por_cat=MAX_PRODUCTOS_POR_CATEGORIA,
        delay=DELAY_ENTRE_CATEGORIAS
    )

    # Guardar resultados
    scraper.guardar_json('productos_scraped.json')


if __name__ == "__main__":
    main()
