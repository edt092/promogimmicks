"""
Scraper Avanzado para Catálogos Promocionales
Extrae información detallada de productos incluyendo características específicas
"""

import requests
from bs4 import BeautifulSoup
import json
import time
import re
from urllib.parse import urljoin
import os
from typing import List, Dict, Optional

class ScraperAvanzado:
    def __init__(self):
        self.base_url = "https://www.catalogospromocionales.com"
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        })
        self.productos = []
        self.categorias = []

    def get_page(self, url: str, retries: int = 3) -> Optional[str]:
        """Obtiene el contenido de una URL con reintentos"""
        for i in range(retries):
            try:
                response = self.session.get(url, timeout=15)
                response.raise_for_status()
                return response.text
            except Exception as e:
                if i == retries - 1:
                    print(f"  [ERROR] {url}: {e}")
                    return None
                time.sleep(2)
        return None

    def generar_slug(self, texto: str) -> str:
        """Genera slug SEO-friendly"""
        texto = texto.lower()
        texto = re.sub(r'[áàâäã]', 'a', texto)
        texto = re.sub(r'[éèêë]', 'e', texto)
        texto = re.sub(r'[íìîï]', 'i', texto)
        texto = re.sub(r'[óòôöõ]', 'o', texto)
        texto = re.sub(r'[úùûü]', 'u', texto)
        texto = re.sub(r'[ñ]', 'n', texto)
        texto = re.sub(r'[^a-z0-9\s-]', '', texto)
        texto = re.sub(r'\s+', '-', texto)
        texto = re.sub(r'-+', '-', texto)
        return texto.strip('-')

    def limpiar_nombre(self, nombre: str) -> str:
        """Limpia y optimiza el nombre del producto"""
        # Remover códigos de referencia
        nombre = re.sub(r'\([^)]*\)', '', nombre)
        nombre = re.sub(r'\[[^\]]*\]', '', nombre)
        nombre = re.sub(r'^\w+-\d+', '', nombre)

        # Limpiar espacios múltiples
        nombre = re.sub(r'\s+', ' ', nombre).strip()

        # Capitalizar correctamente
        palabras = nombre.split()
        nombre_limpio = ' '.join([
            palabra.capitalize() if len(palabra) > 2 else palabra.lower()
            for palabra in palabras
        ])

        return nombre_limpio

    def extraer_detalles_producto(self, producto_url: str) -> Dict:
        """Extrae información detallada de la página del producto"""
        html = self.get_page(producto_url)
        if not html:
            return {}

        soup = BeautifulSoup(html, 'lxml')
        detalles = {}

        # Extraer descripción
        desc_div = soup.find('div', class_=re.compile(r'description|desc|detalle', re.I))
        if desc_div:
            detalles['descripcion_larga'] = desc_div.get_text(strip=True)[:500]

        # Extraer características técnicas
        caracteristicas = []
        specs_section = soup.find(['div', 'section'], class_=re.compile(r'specs|caracteristicas|features', re.I))
        if specs_section:
            items = specs_section.find_all(['li', 'p'])
            caracteristicas = [item.get_text(strip=True) for item in items[:10] if item.get_text(strip=True)]

        detalles['caracteristicas'] = caracteristicas

        # Extraer material si está disponible
        material_pattern = re.search(r'material[:\s]+([a-záéíóúñ\s]+)', html, re.I)
        if material_pattern:
            detalles['material'] = material_pattern.group(1).strip()

        # Extraer colores disponibles
        colores = []
        color_section = soup.find(['div', 'span'], class_=re.compile(r'color', re.I))
        if color_section:
            color_items = color_section.find_all(['span', 'div'])
            colores = [item.get_text(strip=True) for item in color_items if item.get_text(strip=True)]

        detalles['colores'] = colores

        return detalles

    def extraer_subcategorias(self) -> List[tuple]:
        """Extrae todas las subcategorías"""
        print("\n" + "="*70)
        print("EXTRAYENDO SUBCATEGORÍAS")
        print("="*70)

        html = self.get_page(f"{self.base_url}/seccion/subcategorias.html")
        if not html:
            return []

        soup = BeautifulSoup(html, 'lxml')
        categorias_set = set()

        links = soup.find_all('a', href=True)
        for link in links:
            href = link.get('href', '')
            texto = link.get_text(strip=True)

            # Filtrar enlaces relevantes
            if '/promocionales/' in href or '/seccion/' in href:
                if href != '/seccion/subcategorias.html' and texto and len(texto) > 2:
                    full_url = urljoin(self.base_url, href)
                    categorias_set.add((texto, full_url))

        self.categorias = list(categorias_set)
        print(f"[OK] Encontradas {len(self.categorias)} categorías")
        return self.categorias

    def extraer_productos_categoria(self, nombre_cat: str, url_cat: str, max_productos: int = 100) -> List[Dict]:
        """Extrae productos de una categoría con información detallada"""
        print(f"\n  -> Procesando: {nombre_cat}")

        productos = []
        html = self.get_page(url_cat)
        if not html:
            return productos

        soup = BeautifulSoup(html, 'lxml')

        # Buscar contenedores de productos
        product_containers = soup.find_all(['div', 'article'], class_=re.compile(r'product|item|card', re.I))

        if not product_containers:
            # Fallback: buscar enlaces a productos
            product_links = soup.find_all('a', href=re.compile(r'/p/|/catalogo/producto'))
            product_containers = [link.parent for link in product_links if link.parent]

        seen_urls = set()

        for container in product_containers[:max_productos]:
            try:
                # Buscar enlace al producto
                link = container.find('a', href=re.compile(r'/p/|/catalogo/producto'))
                if not link:
                    continue

                producto_url = urljoin(self.base_url, link.get('href', ''))

                if producto_url in seen_urls:
                    continue
                seen_urls.add(producto_url)

                # Extraer nombre
                nombre = None
                for tag in ['h2', 'h3', 'h4', 'strong', 'a']:
                    element = container.find(tag, class_=re.compile(r'title|name|nombre', re.I))
                    if element:
                        nombre = element.get_text(strip=True)
                        break

                if not nombre:
                    nombre = link.get('title', link.get_text(strip=True))

                if not nombre or len(nombre) < 3:
                    continue

                # Extraer imagen
                img = container.find('img')
                imagen_url = ''
                if img:
                    imagen_url = img.get('src') or img.get('data-src') or img.get('data-original', '')
                    imagen_url = urljoin(self.base_url, imagen_url)

                # Limpiar nombre
                nombre_limpio = self.limpiar_nombre(nombre)
                if len(nombre_limpio) < 3:
                    continue

                # Generar slug e ID
                slug = self.generar_slug(nombre_limpio)
                producto_id = self.generar_slug(f"{nombre_cat}-{nombre_limpio}")[:60]

                # Estructura básica del producto
                producto = {
                    'id': producto_id,
                    'nombre': nombre_limpio,
                    'nombre_original': nombre,
                    'slug': slug,
                    'categoria': nombre_cat,
                    'categoria_slug': self.generar_slug(nombre_cat),
                    'imagen_url': imagen_url,
                    'producto_url': producto_url,
                    'caracteristicas_raw': [],
                    'material': '',
                    'colores': []
                }

                productos.append(producto)

            except Exception as e:
                continue

        print(f"     [OK] {len(productos)} productos extraídos")
        return productos

    def scrapear_todo(self, max_categorias: Optional[int] = None, max_productos_por_cat: int = 100, delay: float = 2):
        """Ejecuta el scraping completo"""
        print("\n" + "="*70)
        print("INICIANDO SCRAPING AVANZADO")
        print("="*70)

        categorias = self.extraer_subcategorias()

        if max_categorias:
            categorias = categorias[:max_categorias]

        print(f"\n[INFO] Procesando {len(categorias)} categorías")

        for idx, (nombre, url) in enumerate(categorias, 1):
            print(f"\n[{idx}/{len(categorias)}] {nombre}")
            productos = self.extraer_productos_categoria(nombre, url, max_productos_por_cat)
            self.productos.extend(productos)

            if idx < len(categorias):
                time.sleep(delay)

        print("\n" + "="*70)
        print(f"SCRAPING COMPLETADO")
        print(f"Total productos: {len(self.productos)}")
        print(f"Total categorías: {len(set(p['categoria'] for p in self.productos))}")
        print("="*70 + "\n")

    def guardar_json(self, filename: str = 'productos_avanzado.json'):
        """Guarda los productos en JSON"""
        if not self.productos:
            print("[WARNING] No hay productos para guardar")
            return

        output_dir = os.path.join(os.path.dirname(__file__), '..', 'data')
        os.makedirs(output_dir, exist_ok=True)

        output_path = os.path.join(output_dir, filename)

        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(self.productos, f, ensure_ascii=False, indent=2)

        print(f"\n[OK] Datos guardados en: {output_path}")
        print(f"[OK] Total productos: {len(self.productos)}")

        # Estadísticas
        categorias_count = {}
        for p in self.productos:
            cat = p['categoria']
            categorias_count[cat] = categorias_count.get(cat, 0) + 1

        print(f"[OK] Categorías únicas: {len(categorias_count)}")
        print("\nTop 10 categorías:")
        for cat, count in sorted(categorias_count.items(), key=lambda x: x[1], reverse=True)[:10]:
            print(f"  - {cat}: {count} productos")


def main():
    """Función principal"""
    scraper = ScraperAvanzado()

    # Configuración
    MAX_CATEGORIAS = None  # None = todas
    MAX_PRODUCTOS_POR_CATEGORIA = 200
    DELAY = 2  # segundos entre categorías

    # Ejecutar scraping
    scraper.scrapear_todo(
        max_categorias=MAX_CATEGORIAS,
        max_productos_por_cat=MAX_PRODUCTOS_POR_CATEGORIA,
        delay=DELAY
    )

    # Guardar resultados
    scraper.guardar_json('productos_avanzado.json')


if __name__ == "__main__":
    main()
