"""
Scraper Completo para Marpico Promocionales
Basado en GUIA_SCRAPING_SSG.md
Extrae imágenes, títulos, descripciones y genera metadescripciones SEO
"""

import json
import time
import re
import os
import requests
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException
from typing import List, Dict
from pathlib import Path

class MarpicoScraperCompleto:
    def __init__(self):
        self.base_url = "https://marpicopromocionales.com"
        self.productos = []
        self.driver = None

        # Categorías específicas
        self.categorias_urls = [
            ("30012", "Accesorios"),
            ("30010", "Artículos de Escritura"),
            ("30004", "Bolsos y Mochilas"),
            ("30003", "Deportes y Recreación"),
            ("30009", "Drinkware"),
            ("30008", "Hogar"),
            ("30005", "Oficina"),
            ("30011", "Salud y Bienestar"),
            ("30007", "Tecnología"),
            ("30000", "Textil y Vestuario"),
        ]

        # Directorio para imágenes
        self.img_dir = Path("../public/img/productos")
        self.img_dir.mkdir(parents=True, exist_ok=True)

    def setup_driver(self, headless=False):
        """Configura Selenium con técnicas anti-detección"""
        print("Configurando driver de Selenium con anti-detección...")

        chrome_options = Options()
        if headless:
            chrome_options.add_argument('--headless')

        # Anti-detección
        chrome_options.add_argument('--disable-blink-features=AutomationControlled')
        chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
        chrome_options.add_experimental_option('useAutomationExtension', False)

        # Configuración adicional
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        chrome_options.add_argument('--window-size=1920,1080')
        chrome_options.add_argument('--disable-gpu')
        chrome_options.add_argument('--lang=es')
        chrome_options.add_argument('user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')

        self.driver = webdriver.Chrome(options=chrome_options)

        # Scripts anti-detección
        self.driver.execute_cdp_cmd('Network.setUserAgentOverride', {
            "userAgent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        })

        self.driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")

        print("[OK] Driver configurado")

    def close_driver(self):
        """Cierra el driver"""
        if self.driver:
            self.driver.quit()

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
            response = requests.get(url, timeout=10)
            response.raise_for_status()

            # Guardar imagen
            ruta_completa = self.img_dir / nombre_archivo
            with open(ruta_completa, 'wb') as f:
                f.write(response.content)

            # Retornar ruta relativa
            return f"/img/productos/{nombre_archivo}"
        except Exception as e:
            print(f"    Error descargando imagen: {e}")
            return "/img/placeholder-producto.svg"

    def generar_metadescripcion_seo(self, nombre: str, categoria: str) -> str:
        """Genera metadescripción SEO única"""
        import random

        templates = [
            f"{nombre} personalizado con logo de tu empresa. Ideal para campañas publicitarias, eventos corporativos y merchandising. Entrega en Ecuador.",
            f"Compra {nombre} promocional de alta calidad. Personalización profesional con impresión de logo. Perfecto para regalos empresariales en Ecuador.",
            f"{nombre} para tu marca. Producto promocional con personalización garantizada. Cotiza ahora para eventos, ferias y campañas en Ecuador.",
            f"{nombre} promocional ecuatoriano. Regalo corporativo de impacto con impresión de logo. Ideal para activaciones de marca y merchandising.",
            f"Cotiza {nombre} personalizado en Ecuador. Artículo promocional de calidad premium. Perfecto para empresas, eventos y regalos corporativos.",
        ]

        return random.choice(templates)

    def generar_keywords_seo(self, nombre: str, categoria: str) -> str:
        """Genera keywords para SEO"""
        keywords = [
            nombre.lower(),
            f"{nombre.lower()} personalizado",
            f"{nombre.lower()} promocional",
            f"{nombre.lower()} ecuador",
            f"{nombre.lower()} con logo",
            categoria.lower(),
            "regalo corporativo",
            "merchandising",
            "producto promocional",
            "personalizado ecuador"
        ]
        return ', '.join(keywords[:10])

    def extraer_productos_categoria(self, cat_id: str, cat_nombre: str) -> List[Dict]:
        """Extrae productos de una categoría"""
        url = f"{self.base_url}/#/productos?categoria={cat_id}"
        print(f"\n  -> Categoría: {cat_nombre}")
        print(f"     URL: {url}")

        productos = []

        try:
            self.driver.get(url)

            # Esperar carga completa de Angular (más tiempo)
            print("     Esperando carga de Angular...")
            time.sleep(10)

            # Scroll para lazy loading
            for i in range(5):
                self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
                time.sleep(2)

            self.driver.execute_script("window.scrollTo(0, 0);")
            time.sleep(2)

            # Tomar screenshot para debug
            screenshot_path = f"debug_cat_{cat_id}.png"
            self.driver.save_screenshot(screenshot_path)
            print(f"     Screenshot guardado: {screenshot_path}")

            # Buscar productos con selectores específicos de Angular
            print("     Buscando productos...")

            # Estrategia 1: Buscar componentes Angular de productos
            productos_elementos = []

            # Intentar múltiples selectores
            selectores = [
                "app-producto-card",
                "[class*='producto']",
                "[class*='product-card']",
                "div.card",
                "div[class*='col']",
            ]

            for selector in selectores:
                try:
                    elementos = self.driver.find_elements(By.CSS_SELECTOR, selector)
                    if len(elementos) > 0:
                        print(f"     Selector '{selector}': {len(elementos)} elementos")
                        if len(elementos) > len(productos_elementos):
                            productos_elementos = elementos
                except:
                    continue

            # Estrategia 2: Buscar por imágenes de productos
            imagenes = self.driver.find_elements(By.CSS_SELECTOR, "img[src*='marpicostorage'][src*='productos']")
            print(f"     Imágenes de productos encontradas: {len(imagenes)}")

            if len(imagenes) > 0:
                productos_elementos = [img.find_element(By.XPATH, "./ancestor::div[contains(@class, 'col') or contains(@class, 'card')][1]") for img in imagenes]

            print(f"     Total elementos a procesar: {len(productos_elementos)}")

            seen = set()

            for idx, elemento in enumerate(productos_elementos):
                try:
                    # Scroll al elemento
                    self.driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", elemento)
                    time.sleep(0.5)

                    # Extraer imagen
                    try:
                        img = elemento.find_element(By.TAG_NAME, 'img')
                        imagen_url = img.get_attribute('src') or img.get_attribute('data-src') or ''
                    except:
                        continue

                    if not imagen_url or 'placeholder' in imagen_url.lower() or 'logo' in imagen_url.lower():
                        continue

                    if imagen_url in seen:
                        continue
                    seen.add(imagen_url)

                    # Extraer nombre
                    nombre = img.get_attribute('alt') or img.get_attribute('title') or ''

                    # Si no hay nombre en la imagen, buscar en el contenedor
                    if not nombre or len(nombre) < 3:
                        try:
                            # Buscar headers
                            for tag in ['h1', 'h2', 'h3', 'h4', 'h5']:
                                try:
                                    header = elemento.find_element(By.TAG_NAME, tag)
                                    texto = header.text.strip()
                                    if texto and len(texto) > 3:
                                        nombre = texto
                                        break
                                except:
                                    continue
                        except:
                            pass

                    # Si aún no hay nombre, usar el filename de la imagen
                    if not nombre or len(nombre) < 3:
                        try:
                            nombre = imagen_url.split('/')[-1].split('.')[0]
                            nombre = nombre.replace('_', ' ').replace('-', ' ').title()
                        except:
                            nombre = f"Producto {idx + 1} - {cat_nombre}"

                    # Limpiar nombre
                    nombre = re.sub(r'\([^)]*\)', '', nombre)
                    nombre = re.sub(r'\[[^\]]*\]', '', nombre)
                    nombre = ' '.join(nombre.split()).strip()

                    if len(nombre) < 3:
                        continue

                    # Extraer descripción
                    descripcion = ''
                    try:
                        parrafos = elemento.find_elements(By.TAG_NAME, 'p')
                        for p in parrafos:
                            texto = p.text.strip()
                            if texto and len(texto) > 20 and 'precio' not in texto.lower():
                                descripcion = texto[:300]
                                break
                    except:
                        pass

                    # Generar slug
                    slug = self.generar_slug(nombre)

                    # Descargar imagen
                    nombre_archivo = f"{slug}.jpg"
                    imagen_local = self.descargar_imagen(imagen_url, nombre_archivo)

                    # Generar metadescripción SEO
                    seo_description = self.generar_metadescripcion_seo(nombre, cat_nombre)
                    seo_keywords = self.generar_keywords_seo(nombre, cat_nombre)

                    # Crear producto
                    producto = {
                        'id': f"{cat_id}-{slug}"[:60],
                        'nombre': nombre,
                        'slug': slug,
                        'categoria': cat_nombre,
                        'categoria_slug': self.generar_slug(cat_nombre),
                        'descripcion_corta': descripcion or seo_description,
                        'imagen_url': imagen_local,
                        'imagen_original_url': imagen_url,
                        'seo_title': f"{nombre} Personalizado Ecuador | PromoGimmicks",
                        'seo_description': seo_description,
                        'seo_keywords': seo_keywords,
                    }

                    productos.append(producto)

                    if (idx + 1) % 5 == 0:
                        print(f"     Procesados {idx + 1} elementos...")

                except Exception as e:
                    continue

            print(f"     [OK] {len(productos)} productos extraídos y guardados")
            return productos

        except Exception as e:
            print(f"     [ERROR] {e}")
            import traceback
            traceback.print_exc()
            return []

    def scrapear_todas_categorias(self):
        """Scrapea todas las categorías"""
        print("\n" + "="*70)
        print("SCRAPING COMPLETO MARPICO - CON DESCARGA DE IMÁGENES")
        print("="*70)

        try:
            self.setup_driver(headless=False)

            total = len(self.categorias_urls)
            print(f"\n[INFO] {total} categorías a procesar\n")

            for idx, (cat_id, cat_nombre) in enumerate(self.categorias_urls, 1):
                print(f"[{idx}/{total}] Procesando: {cat_nombre} (ID: {cat_id})")

                productos = self.extraer_productos_categoria(cat_id, cat_nombre)
                self.productos.extend(productos)

                print(f"     Total acumulado: {len(self.productos)} productos")

                if idx < total:
                    print("     Esperando antes de siguiente categoría...")
                    time.sleep(5)

            print("\n" + "="*70)
            print(f"SCRAPING COMPLETADO")
            print(f"Total productos: {len(self.productos)}")
            print("="*70)

        finally:
            self.close_driver()

    def guardar_json(self, filename='productos_marpico_scraped.json'):
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

        print(f"\nProductos por categoría:")
        for cat, count in sorted(cats.items()):
            print(f"  - {cat}: {count} productos")

        # Muestra
        print("\n--- MUESTRA DE PRODUCTOS ---")
        for p in self.productos[:3]:
            print(f"\n* {p['nombre']}")
            print(f"  Categoría: {p['categoria']}")
            print(f"  Imagen local: {p['imagen_url']}")
            print(f"  SEO Title: {p['seo_title'][:60]}...")


def main():
    scraper = MarpicoScraperCompleto()

    try:
        scraper.scrapear_todas_categorias()
        scraper.guardar_json('productos_marpico_scraped.json')

        print("\n" + "="*70)
        print("SCRAPING EXITOSO")
        print("="*70)
        print("\nPróximos pasos:")
        print("1. Verifica las imágenes en: public/img/productos/")
        print("2. Revisa el JSON en: promo-scraper/data/productos_marpico_scraped.json")
        print("3. Copia el JSON a: data/products.json")
        print("4. Reinicia el servidor: npm run dev")

    except Exception as e:
        print(f"\nERROR: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()
