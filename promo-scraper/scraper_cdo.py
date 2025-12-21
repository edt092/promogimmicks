"""
Scraper para CDO Promocionales Colombia
Extrae productos de todas las categorías con imágenes y descripciones
"""

import json
import time
import re
import os
import requests
from bs4 import BeautifulSoup
from pathlib import Path
from typing import List, Dict
import random

class ScraperCDO:
    def __init__(self):
        self.base_url = "https://colombia.cdopromocionales.com"
        self.productos = []

        # 27 categorías identificadas
        self.categorias = [
            ("tecnologia", "Tecnología"),
            ("eco", "Eco"),
            ("morrales-maletines-bolsos-bolsas", "Bolsos y Mochilas"),
            ("gorros", "Accesorios"),
            ("botellas-mugs-vasos", "Drinkware"),
            ("escrituras-metalicas", "Artículos de Escritura"),
            ("escrituras-plasticas-y-otros", "Artículos de Escritura"),
            ("oficina-y-negocios", "Oficina"),
            ("tiempo-libre", "Deportes y Recreación"),
            ("hogar", "Hogar"),
            ("salud-y-belleza", "Salud y Bienestar"),
            ("llaveros", "Accesorios"),
            ("herramientas", "Accesorios"),
            ("viajes", "Accesorios"),
            ("automovil", "Accesorios"),
            ("nivel-ejecutivo", "Oficina"),
            ("audio", "Tecnología"),
            ("kits-sets", "Accesorios"),
            ("temporada-deportiva", "Deportes y Recreación"),
            ("variedad-de-colores", "Textil y Vestuario"),
            ("paraguas-sombrillas", "Accesorios"),
            ("masivos", "Accesorios"),
            ("sublimables", "Hogar"),
            ("nuevos", "Accesorios"),
            ("ofertas", "Accesorios"),
            ("precios-mejorados", "Accesorios"),
            ("reingresos-super-esperados", "Accesorios"),
        ]

        # Directorio para imágenes
        self.img_dir = Path("../public/img/productos")
        self.img_dir.mkdir(parents=True, exist_ok=True)

        # Headers para evitar bloqueos
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
        }

        # Templates SEO por categoría
        self.templates_seo = {
            'Artículos de Escritura': [
                "{nombre} personalizado con logo. Regalo corporativo perfecto para empresas en Ecuador. Impresión de alta calidad garantizada.",
                "Compra {nombre} promocional en Ecuador. Artículo de escritura personalizable con tu marca. Ideal para eventos corporativos.",
                "{nombre} para tu empresa. Producto promocional de calidad premium. Entrega rápida en Quito, Guayaquil y todo Ecuador.",
            ],
            'Drinkware': [
                "{nombre} personalizado para tu marca. Producto promocional de alta durabilidad. Perfecto para campañas publicitarias en Ecuador.",
                "Cotiza {nombre} con logo de tu empresa. Drinkware promocional de calidad premium. Ideal para regalos corporativos.",
                "{nombre} promocional ecuatoriano. Personalización profesional con impresión duradera. Excelente para merchandising empresarial.",
            ],
            'Textil y Vestuario': [
                "{nombre} personalizado con bordado o estampado. Vestuario promocional de alta calidad para empresas en Ecuador.",
                "Cotiza {nombre} con logo de tu marca. Textil promocional profesional. Ideal para uniformes corporativos y eventos.",
            ],
            'Tecnología': [
                "{nombre} personalizado con logo. Gadget promocional de última generación. Regalo corporativo tecnológico en Ecuador.",
                "Compra {nombre} promocional de alta calidad. Tech gift perfecto para empresas. Personalización profesional garantizada.",
                "{nombre} con impresión de tu marca. Producto tecnológico promocional. Ideal para eventos, ferias y regalos ejecutivos.",
            ],
            'Bolsos y Mochilas': [
                "{nombre} personalizado con logo bordado. Bolso promocional de alta resistencia. Ideal para eventos corporativos en Ecuador.",
                "Compra {nombre} con impresión de tu marca. Mochila promocional de calidad premium. Perfecto para regalos empresariales.",
            ],
            'Accesorios': [
                "{nombre} personalizado con logo. Accesorio promocional práctico y memorable. Regalo corporativo en Ecuador.",
                "Cotiza {nombre} con impresión de tu marca. Accesorio útil para campañas publicitarias. Personalización de calidad.",
            ],
            'Oficina': [
                "{nombre} personalizado con logo. Artículo de oficina promocional de calidad. Ideal para empresas en Ecuador.",
                "Cotiza {nombre} con impresión corporativa. Producto de oficina útil y elegante. Perfecto para regalos empresariales.",
            ],
            'Hogar': [
                "{nombre} personalizado con logo. Artículo para el hogar promocional. Regalo corporativo útil y memorable en Ecuador.",
                "Cotiza {nombre} con impresión de tu marca. Producto para el hogar de calidad. Ideal para campañas publicitarias.",
            ],
            'Deportes y Recreación': [
                "{nombre} personalizado con logo. Artículo deportivo promocional de calidad. Ideal para eventos en Ecuador.",
                "Cotiza {nombre} con impresión de tu marca. Producto deportivo perfecto para campañas de wellness corporativo.",
            ],
            'Salud y Bienestar': [
                "{nombre} personalizado con logo. Producto de salud promocional responsable. Ideal para empresas en Ecuador.",
                "Cotiza {nombre} con impresión corporativa. Artículo de bienestar de calidad. Perfecto para campañas de salud.",
            ],
        }

    def generar_slug(self, texto: str) -> str:
        """Genera slug SEO-friendly"""
        texto = str(texto).lower()
        # Reemplazar acentos
        texto = re.sub(r'[áàâäã]', 'a', texto)
        texto = re.sub(r'[éèêë]', 'e', texto)
        texto = re.sub(r'[íìîï]', 'i', texto)
        texto = re.sub(r'[óòôöõ]', 'o', texto)
        texto = re.sub(r'[úùûü]', 'u', texto)
        texto = re.sub(r'[ñ]', 'n', texto)
        # Limpiar caracteres especiales
        texto = re.sub(r'[^a-z0-9\s-]', '', texto)
        texto = re.sub(r'\s+', '-', texto)
        texto = re.sub(r'-+', '-', texto)
        return texto.strip('-')

    def descargar_imagen(self, url: str, nombre_archivo: str) -> str:
        """Descarga imagen localmente"""
        try:
            # Si la URL es relativa, hacerla absoluta
            if url.startswith('//'):
                url = 'https:' + url
            elif url.startswith('/'):
                url = self.base_url + url

            response = requests.get(url, timeout=15, headers=self.headers)
            response.raise_for_status()

            # Guardar imagen
            ruta_completa = self.img_dir / nombre_archivo
            with open(ruta_completa, 'wb') as f:
                f.write(response.content)

            # Retornar ruta relativa
            return f"/img/productos/{nombre_archivo}"
        except Exception as e:
            print(f"      Error descargando imagen: {e}")
            return "/img/placeholder-producto.svg"

    def generar_seo_description(self, nombre: str, categoria: str) -> str:
        """Genera metadescripción SEO única"""
        templates = self.templates_seo.get(categoria, self.templates_seo['Accesorios'])
        template = random.choice(templates)
        return template.format(nombre=nombre)

    def generar_seo_keywords(self, nombre: str, categoria: str) -> str:
        """Genera keywords SEO"""
        nombre_lower = nombre.lower()
        categoria_lower = categoria.lower()

        keywords = [
            nombre_lower,
            f"{nombre_lower} personalizado",
            f"{nombre_lower} promocional",
            f"{nombre_lower} con logo",
            f"{nombre_lower} ecuador",
            categoria_lower,
            "regalo corporativo",
            "merchandising ecuador",
            "producto promocional",
            "personalizado logo",
        ]

        return ', '.join(keywords[:12])

    def limpiar_nombre_producto(self, nombre: str, codigo: str = "") -> str:
        """Limpia y mejora el nombre del producto"""
        # Eliminar código si está en el nombre
        if codigo:
            nombre = nombre.replace(codigo, '').strip()

        # Eliminar comillas extra
        nombre = nombre.replace("'", "").replace('"', '')

        # Capitalizar correctamente
        nombre = ' '.join(word.capitalize() for word in nombre.split())

        return nombre.strip()

    def extraer_productos_categoria(self, cat_slug: str, cat_nombre: str) -> List[Dict]:
        """Extrae productos de una categoría"""
        url = f"{self.base_url}/products?categoria={cat_slug}"
        print(f"\n  -> Categoria: {cat_nombre}")
        print(f"     URL: {url}")

        productos = []

        try:
            # Hacer request
            response = requests.get(url, headers=self.headers, timeout=20)
            response.raise_for_status()

            # Parsear HTML
            soup = BeautifulSoup(response.content, 'html.parser')

            # Buscar productos
            # Basado en la estructura típica de Rails: divs con clase product-card o similar
            productos_elementos = soup.find_all(['div', 'article'], class_=lambda c: c and ('product' in c.lower() or 'item' in c.lower()))

            # Si no encontramos con clases, buscar por enlaces a /products/
            if not productos_elementos:
                enlaces_productos = soup.find_all('a', href=lambda h: h and '/products/' in h)
                productos_elementos = [a.find_parent(['div', 'article']) for a in enlaces_productos if a.find_parent(['div', 'article'])]
                productos_elementos = list(set(filter(None, productos_elementos)))  # Eliminar duplicados y None

            print(f"     Productos encontrados: {len(productos_elementos)}")

            seen = set()

            for idx, elemento in enumerate(productos_elementos):
                try:
                    # Extraer código del producto
                    codigo = ""
                    codigo_elem = elemento.find(string=re.compile(r'^[A-Z]{1,3}\d{3,4}$'))
                    if codigo_elem:
                        codigo = codigo_elem.strip()

                    # Extraer nombre
                    nombre = ""
                    # Buscar en headers
                    for tag in ['h1', 'h2', 'h3', 'h4', 'h5', 'p']:
                        nombre_elem = elemento.find(tag)
                        if nombre_elem:
                            nombre = nombre_elem.get_text(strip=True)
                            if len(nombre) > 3:
                                break

                    # Si no hay nombre, buscar en link
                    if not nombre or len(nombre) < 3:
                        link = elemento.find('a', href=lambda h: h and '/products/' in h)
                        if link:
                            nombre = link.get('title', '') or link.get_text(strip=True)

                    # Extraer imagen
                    img = elemento.find('img')
                    if not img:
                        continue

                    imagen_url = img.get('src') or img.get('data-src') or img.get('data-lazy-src') or ''
                    if not imagen_url or 'placeholder' in imagen_url.lower() or 'logo' in imagen_url.lower():
                        continue

                    # Usar alt de la imagen si no hay nombre
                    if not nombre or len(nombre) < 3:
                        nombre = img.get('alt', '')

                    # Limpiar nombre
                    nombre = self.limpiar_nombre_producto(nombre, codigo)

                    # Si aún no hay nombre válido, skip
                    if not nombre or len(nombre) < 3:
                        continue

                    # Evitar duplicados
                    producto_key = f"{nombre}-{imagen_url}"
                    if producto_key in seen:
                        continue
                    seen.add(producto_key)

                    # Generar slug
                    slug = self.generar_slug(nombre)
                    if codigo:
                        slug = f"{self.generar_slug(codigo)}-{slug}"

                    # Descargar imagen
                    extension = 'jpg'
                    if '.png' in imagen_url.lower():
                        extension = 'png'
                    nombre_archivo = f"{slug}.{extension}"
                    imagen_local = self.descargar_imagen(imagen_url, nombre_archivo)

                    # Generar SEO
                    seo_description = self.generar_seo_description(nombre, cat_nombre)
                    seo_keywords = self.generar_seo_keywords(nombre, cat_nombre)

                    # Crear producto
                    producto = {
                        'id': slug[:60],
                        'nombre': nombre,
                        'slug': slug,
                        'categoria': cat_nombre,
                        'categoria_slug': self.generar_slug(cat_nombre),
                        'descripcion_corta': seo_description,
                        'imagen_url': imagen_local,
                        'imagen_original_url': imagen_url,
                        'codigo': codigo if codigo else None,
                        'seo_title': f"{nombre} Personalizado Ecuador | PromoGimmicks",
                        'seo_description': seo_description,
                        'seo_keywords': seo_keywords,
                    }

                    productos.append(producto)

                    if (idx + 1) % 10 == 0:
                        print(f"     Procesados {idx + 1} elementos...")

                except Exception as e:
                    continue

            print(f"     [OK] {len(productos)} productos validos extraidos")
            return productos

        except Exception as e:
            print(f"     [ERROR] {e}")
            return []

    def scrapear_todas_categorias(self):
        """Scrapea todas las categorías"""
        print("\n" + "="*70)
        print("SCRAPING CDO PROMOCIONALES - COLOMBIA")
        print("="*70)

        total = len(self.categorias)
        print(f"\n[INFO] {total} categorias a procesar\n")

        for idx, (cat_slug, cat_nombre) in enumerate(self.categorias, 1):
            print(f"[{idx}/{total}] Procesando: {cat_nombre} ({cat_slug})")

            productos = self.extraer_productos_categoria(cat_slug, cat_nombre)
            self.productos.extend(productos)

            print(f"     Total acumulado: {len(self.productos)} productos")

            # Delay entre categorías
            if idx < total:
                print("     Esperando antes de siguiente categoria...")
                time.sleep(3)

        print("\n" + "="*70)
        print(f"SCRAPING COMPLETADO")
        print(f"Total productos: {len(self.productos)}")
        print("="*70)

    def guardar_json(self, filename='productos_cdo_scraped.json'):
        """Guarda productos en JSON"""
        if not self.productos:
            print("[WARNING] No hay productos para guardar")
            return

        output_dir = Path('data')
        output_dir.mkdir(exist_ok=True)

        output_path = output_dir / filename

        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(self.productos, f, ensure_ascii=False, indent=2)

        print(f"\n[OK] Guardado: {output_path}")
        print(f"[OK] Total: {len(self.productos)} productos")

        # Estadísticas
        cats = {}
        for p in self.productos:
            cat = p['categoria']
            cats[cat] = cats.get(cat, 0) + 1

        print(f"\nProductos por categoria:")
        for cat, count in sorted(cats.items()):
            print(f"  - {cat}: {count} productos")

        # Muestra
        print("\n--- MUESTRA DE PRODUCTOS ---")
        for p in self.productos[:5]:
            print(f"\n* {p['nombre']}")
            if p.get('codigo'):
                print(f"  Codigo: {p['codigo']}")
            print(f"  Categoria: {p['categoria']}")
            print(f"  Imagen local: {p['imagen_url']}")
            print(f"  SEO Title: {p['seo_title'][:60]}...")


def main():
    scraper = ScraperCDO()

    try:
        scraper.scrapear_todas_categorias()
        scraper.guardar_json('productos_cdo_scraped.json')

        print("\n" + "="*70)
        print("SCRAPING EXITOSO")
        print("="*70)
        print("\nProximos pasos:")
        print("1. Verifica las imagenes en: public/img/productos/")
        print("2. Revisa el JSON en: promo-scraper/data/productos_cdo_scraped.json")
        print("3. Copia el JSON a: data/products.json")
        print("4. Reinicia el servidor: npm run dev")

    except Exception as e:
        print(f"\nERROR: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()
