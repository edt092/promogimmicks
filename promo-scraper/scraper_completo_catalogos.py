import requests
from bs4 import BeautifulSoup
import json
import time
import re
from urllib.parse import urljoin, urlparse
import os

class CatalogosPromoScraper:
    """Scraper optimizado para catalogospromocionales.com"""

    def __init__(self):
        self.base_url = "https://www.catalogospromocionales.com"
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
        self.categorias = []
        self.productos_por_categoria = {}
        self.todos_productos = []

    def get_page(self, url):
        """Obtiene contenido de una URL"""
        try:
            print(f"  Fetching: {url[:80]}...")
            response = self.session.get(url, timeout=15)
            response.raise_for_status()
            return response.text
        except Exception as e:
            print(f"  [ERROR] {e}")
            return None

    def extraer_categorias(self):
        """Extrae todas las categorías del sitio"""
        print("\n" + "="*70)
        print("EXTRAYENDO CATEGORIAS")
        print("="*70)

        # URL principal de categorías
        url = f"{self.base_url}/seccion/subcategorias.html"
        html = self.get_page(url)

        if not html:
            print("[ERROR] No se pudo obtener la pagina de categorias")
            return []

        soup = BeautifulSoup(html, 'lxml')

        # Buscar enlaces a categorías
        # Las categorías suelen estar en enlaces con patrones específicos
        categorias_dict = {}

        # Buscar todos los enlaces
        links = soup.find_all('a', href=True)

        for link in links:
            href = link.get('href', '')
            texto = link.get_text(strip=True)

            # Filtrar enlaces que son categorías
            # Patrón: /promocionales/[categoria].html o /Catalogo/Default.aspx?id=XXX
            if '/promocionales/' in href and texto and len(texto) > 2:
                full_url = urljoin(self.base_url, href)
                if full_url not in categorias_dict.values():
                    categorias_dict[texto] = full_url
            elif 'Catalogo/Default.aspx?id=' in href and texto and len(texto) > 2:
                full_url = urljoin(self.base_url, href)
                if full_url not in categorias_dict.values():
                    categorias_dict[texto] = full_url

        self.categorias = [(nombre, url) for nombre, url in categorias_dict.items()]

        print(f"[OK] Encontradas {len(self.categorias)} categorias")
        print("\nCategorias:")
        for i, (nombre, url) in enumerate(self.categorias[:10], 1):
            print(f"  {i}. {nombre}")
        if len(self.categorias) > 10:
            print(f"  ... y {len(self.categorias) - 10} mas")

        return self.categorias

    def generar_slug(self, texto):
        """Genera slug SEO-friendly"""
        texto = texto.lower()
        # Reemplazar caracteres especiales
        texto = re.sub(r'[áàâä]', 'a', texto)
        texto = re.sub(r'[éèêë]', 'e', texto)
        texto = re.sub(r'[íìîï]', 'i', texto)
        texto = re.sub(r'[óòôö]', 'o', texto)
        texto = re.sub(r'[úùûü]', 'u', texto)
        texto = re.sub(r'[ñ]', 'n', texto)
        # Solo letras, números y espacios
        texto = re.sub(r'[^a-z0-9\s-]', '', texto)
        # Espacios a guiones
        texto = re.sub(r'\s+', '-', texto)
        texto = re.sub(r'-+', '-', texto)
        return texto.strip('-')

    def limpiar_nombre_producto(self, nombre):
        """Limpia y optimiza el nombre del producto"""
        # Remover códigos de referencia
        nombre = re.sub(r'\([^)]*\)', '', nombre)
        nombre = re.sub(r'\[[^\]]*\]', '', nombre)
        nombre = re.sub(r'^\w+-\d+', '', nombre)  # Quitar códigos iniciales como "MU-442"

        # Limpiar espacios múltiples
        nombre = re.sub(r'\s+', ' ', nombre).strip()

        # Capitalizar
        palabras = nombre.split()
        nombre_limpio = ' '.join([
            palabra.capitalize() if len(palabra) > 2 else palabra.lower()
            for palabra in palabras
        ])

        return nombre_limpio

    def extraer_productos_categoria(self, categoria_nombre, categoria_url, max_paginas=10):
        """Extrae productos de una categoría"""
        print(f"\n  -> {categoria_nombre}")

        productos = []

        for pagina in range(1, max_paginas + 1):
            # Construir URL con paginación
            if pagina == 1:
                url = categoria_url
            else:
                # Agregar parámetro de página
                if '?' in categoria_url:
                    url = f"{categoria_url}&Page={pagina}"
                else:
                    url = f"{categoria_url}?Page={pagina}"

            html = self.get_page(url)
            if not html:
                break

            soup = BeautifulSoup(html, 'lxml')

            # Buscar productos
            productos_en_pagina = 0

            # Patrón 1: Divs con información de producto
            product_divs = soup.find_all('div', class_=re.compile(r'product|item', re.I))

            for div in product_divs:
                try:
                    # Buscar imagen
                    img = div.find('img')
                    if not img:
                        continue

                    imagen_url = img.get('src', '')
                    if imagen_url:
                        imagen_url = urljoin(self.base_url, imagen_url)

                    # Buscar enlace al producto
                    link = div.find('a', href=True)
                    if not link:
                        continue

                    producto_url = urljoin(self.base_url, link.get('href', ''))

                    # Buscar nombre
                    nombre = None
                    h3 = div.find('h3')
                    if h3:
                        nombre = h3.get_text(strip=True)
                    elif link:
                        nombre = link.get('title', link.get_text(strip=True))

                    if not nombre or len(nombre) < 3:
                        continue

                    # Limpiar nombre
                    nombre_limpio = self.limpiar_nombre_producto(nombre)
                    if len(nombre_limpio) < 3:
                        continue

                    # Generar datos
                    slug = self.generar_slug(nombre_limpio)
                    producto_id = self.generar_slug(f"{categoria_nombre}-{nombre_limpio}")[:50]

                    producto = {
                        'id': producto_id,
                        'nombre': nombre_limpio,
                        'nombre_original': nombre,
                        'slug': slug,
                        'categoria': categoria_nombre,
                        'categoria_slug': self.generar_slug(categoria_nombre),
                        'imagen_url': imagen_url,
                        'producto_url': producto_url
                    }

                    # Evitar duplicados
                    if not any(p['producto_url'] == producto_url for p in productos):
                        productos.append(producto)
                        productos_en_pagina += 1

                except Exception as e:
                    continue

            print(f"     Pagina {pagina}: {productos_en_pagina} productos")

            # Si no encontró productos, detener paginación
            if productos_en_pagina == 0:
                break

            # Delay entre páginas
            time.sleep(1)

        print(f"     [TOTAL] {len(productos)} productos en {categoria_nombre}")
        return productos

    def scrapear_todo(self, max_categorias=None, max_paginas_por_categoria=10):
        """Ejecuta scraping completo"""
        print("\n" + "="*70)
        print("INICIANDO SCRAPING COMPLETO DE CATALOGOS PROMOCIONALES")
        print("="*70)

        # Extraer categorías
        categorias = self.extraer_categorias()

        if not categorias:
            print("\n[ERROR] No se encontraron categorias")
            return

        # Limitar categorías si se especifica
        if max_categorias:
            categorias = categorias[:max_categorias]

        print(f"\n" + "="*70)
        print(f"EXTRAYENDO PRODUCTOS DE {len(categorias)} CATEGORIAS")
        print("="*70)

        # Procesar cada categoría
        for idx, (nombre, url) in enumerate(categorias, 1):
            print(f"\n[{idx}/{len(categorias)}] {nombre}")

            productos = self.extraer_productos_categoria(
                nombre,
                url,
                max_paginas=max_paginas_por_categoria
            )

            if productos:
                self.productos_por_categoria[nombre] = productos
                self.todos_productos.extend(productos)

            # Delay entre categorías
            time.sleep(2)

        print("\n" + "="*70)
        print("SCRAPING COMPLETADO")
        print("="*70)
        print(f"Total categorias: {len(self.productos_por_categoria)}")
        print(f"Total productos: {len(self.todos_productos)}")
        print("="*70 + "\n")

    def guardar_json(self):
        """Guarda los datos en JSON"""
        output_dir = os.path.join(os.path.dirname(__file__), '..', 'data')
        os.makedirs(output_dir, exist_ok=True)

        # Guardar todos los productos
        productos_path = os.path.join(output_dir, 'productos_scraped_completo.json')
        with open(productos_path, 'w', encoding='utf-8') as f:
            json.dump(self.todos_productos, f, ensure_ascii=False, indent=2)

        print(f"[OK] Productos guardados: {productos_path}")

        # Guardar categorías con estadísticas
        categorias_stats = []
        for nombre, productos in self.productos_por_categoria.items():
            categorias_stats.append({
                'nombre': nombre,
                'slug': self.generar_slug(nombre),
                'total_productos': len(productos),
                'muestra_productos': productos[:3]
            })

        categorias_path = os.path.join(output_dir, 'categorias_scraped.json')
        with open(categorias_path, 'w', encoding='utf-8') as f:
            json.dump(categorias_stats, f, ensure_ascii=False, indent=2)

        print(f"[OK] Categorias guardadas: {categorias_path}")

        # Mostrar resumen
        print("\n--- RESUMEN ---")
        print(f"Categorias: {len(self.productos_por_categoria)}")
        print(f"Productos totales: {len(self.todos_productos)}")

        print("\n--- TOP 5 CATEGORIAS ---")
        top_cats = sorted(
            self.productos_por_categoria.items(),
            key=lambda x: len(x[1]),
            reverse=True
        )[:5]

        for nombre, productos in top_cats:
            print(f"  * {nombre}: {len(productos)} productos")

        print("\n--- MUESTRA DE PRODUCTOS ---")
        for producto in self.todos_productos[:5]:
            print(f"\n* {producto['nombre']}")
            print(f"  Categoria: {producto['categoria']}")
            print(f"  Imagen: {producto['imagen_url'][:60]}...")


def main():
    """Función principal"""
    scraper = CatalogosPromoScraper()

    # Configuración
    MAX_CATEGORIAS = None  # None = todas las categorías
    MAX_PAGINAS_POR_CATEGORIA = 5  # Páginas por categoría

    # Ejecutar scraping
    scraper.scrapear_todo(
        max_categorias=MAX_CATEGORIAS,
        max_paginas_por_categoria=MAX_PAGINAS_POR_CATEGORIA
    )

    # Guardar resultados
    scraper.guardar_json()


if __name__ == "__main__":
    main()
