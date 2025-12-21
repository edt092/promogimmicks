"""
Scraper Mejorado para Marpico Promocionales
Versión con mejor manejo de contenido dinámico Angular
"""

import json
import time
import re
import os
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from typing import List, Dict

class MarpicoScraperMejorado:
    def __init__(self, headless=False):
        self.base_url = "https://marpicopromocionales.com"
        self.productos = []
        self.driver = None
        self.headless = headless

        # Categorías a scrapear
        self.categorias = [
            "30012", "30010", "30004", "30003", "30009",
            "30008", "30005", "30011", "30007", "30000"
        ]

    def setup_driver(self):
        """Configura el driver de Selenium"""
        print("Configurando driver de Selenium...")
        chrome_options = Options()

        if self.headless:
            chrome_options.add_argument('--headless')

        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        chrome_options.add_argument('--window-size=1920,1080')
        chrome_options.add_argument('--disable-blink-features=AutomationControlled')
        chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
        chrome_options.add_experimental_option('useAutomationExtension', False)
        chrome_options.add_argument('user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')

        self.driver = webdriver.Chrome(options=chrome_options)
        self.driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
        print("[OK] Driver configurado")

    def close_driver(self):
        """Cierra el driver"""
        if self.driver:
            self.driver.quit()

    def generar_slug(self, texto: str) -> str:
        """Genera slug SEO-friendly"""
        texto = str(texto).lower()
        texto = re.sub(r'[áàâäã]', 'a', texto)
        texto = re.sub(r'[éèêë]', 'e', texto)
        texto = re.sub(r'[íìîï]', 'i', texto)
        texto = re.sub(r'[óòôöõ]', 'o', texto)
        texto = re.sub(r'[úùûü]', 'u', texto)
        texto = re.sub(r'[ñ]', 'n', texto)
        texto = re.sub(r'[^a-z0-9\s-]', '', texto)
        texto = re.sub(r'\s+', '-', texto)
        return texto.strip('-')

    def esperar_carga_productos(self, timeout=15):
        """Espera a que los productos se carguen en la página"""
        print("     Esperando carga de productos...")

        # Esperar que aparezcan imágenes de productos
        try:
            WebDriverWait(self.driver, timeout).until(
                lambda d: len(d.find_elements(By.XPATH, "//img[contains(@src, 'marpicostorage') and contains(@src, 'productos')]")) > 0
            )
            print("     [OK] Productos detectados")
            return True
        except TimeoutException:
            print("     [WARNING] Timeout esperando productos")
            return False

    def extraer_productos_categoria(self, categoria_id: str) -> List[Dict]:
        """Extrae productos de una categoría"""
        url = f"{self.base_url}/#/productos?categoria={categoria_id}"
        print(f"\n  -> Categoría {categoria_id}")
        print(f"     URL: {url}")

        productos = []

        try:
            self.driver.get(url)

            # Esperar carga inicial de Angular
            time.sleep(8)

            # Buscar el nombre de la categoría
            nombre_categoria = "General"
            try:
                # Intentar obtener el nombre desde breadcrumb o título
                posibles_titulos = self.driver.find_elements(By.XPATH, "//h1 | //h2 | //h3")
                for titulo in posibles_titulos:
                    texto = titulo.text.strip()
                    if texto and len(texto) > 2 and 'PORTAFOLIO' not in texto.upper() and 'MARPICO' not in texto.upper():
                        nombre_categoria = texto
                        break
            except:
                pass

            print(f"     Categoría: {nombre_categoria}")

            # Esperar que se carguen productos
            if not self.esperar_carga_productos():
                print("     [INFO] Intentando con estrategia alternativa...")

            # Hacer scroll para cargar lazy loading
            for i in range(5):
                self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
                time.sleep(2)

            self.driver.execute_script("window.scrollTo(0, 0);")
            time.sleep(2)

            # Buscar todas las imágenes de productos
            imagenes_productos = self.driver.find_elements(
                By.XPATH,
                "//img[contains(@src, 'marpicostorage') and contains(@src, 'productos') and not(contains(@src, 'logo'))]"
            )

            print(f"     Encontradas {len(imagenes_productos)} imágenes de productos")

            seen = set()

            for idx, img in enumerate(imagenes_productos):
                try:
                    # Scroll al elemento
                    self.driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", img)
                    time.sleep(0.5)

                    # Obtener URL de imagen
                    imagen_url = img.get_attribute('src')

                    if not imagen_url or imagen_url in seen:
                        continue
                    seen.add(imagen_url)

                    # Intentar obtener nombre del alt o title
                    nombre = img.get_attribute('alt') or img.get_attribute('title') or ''

                    # Si no hay nombre, buscar en el contenedor padre
                    if not nombre or len(nombre) < 3:
                        try:
                            padre = img.find_element(By.XPATH, "./ancestor::div[contains(@class, 'col') or contains(@class, 'card')][1]")
                            # Buscar texto en el padre
                            textos = padre.text.split('\n')
                            for texto in textos:
                                texto = texto.strip()
                                if texto and len(texto) > 3 and texto not in ['Ver más', 'Cotizar', 'Agregar', 'Comprar']:
                                    nombre = texto
                                    break
                        except:
                            pass

                    # Si aún no hay nombre, extraer de la URL
                    if not nombre or len(nombre) < 3:
                        try:
                            nombre = imagen_url.split('/')[-1].split('.')[0]
                            nombre = nombre.replace('_', ' ').replace('-', ' ').title()
                        except:
                            nombre = f"Producto {idx + 1}"

                    # Limpiar nombre
                    nombre = re.sub(r'\([^)]*\)', '', nombre)
                    nombre = re.sub(r'\[[^\]]*\]', '', nombre)
                    nombre = ' '.join(nombre.split()).strip()

                    if len(nombre) < 3:
                        continue

                    # Buscar descripción
                    descripcion = f"{nombre} personalizado con logo. Producto promocional de alta calidad ideal para eventos corporativos."

                    try:
                        padre = img.find_element(By.XPATH, "./ancestor::div[contains(@class, 'col') or contains(@class, 'card')][1]")
                        parrafos = padre.find_elements(By.TAG_NAME, 'p')
                        for p in parrafos:
                            texto = p.text.strip()
                            if texto and len(texto) > 20 and 'precio' not in texto.lower():
                                descripcion = texto[:300]
                                break
                    except:
                        pass

                    # Crear producto
                    slug = self.generar_slug(nombre)
                    producto = {
                        'id': self.generar_slug(f"{categoria_id}-{nombre}")[:60],
                        'nombre': nombre,
                        'slug': slug,
                        'categoria': nombre_categoria,
                        'categoria_id': categoria_id,
                        'categoria_slug': self.generar_slug(nombre_categoria),
                        'descripcion_corta': descripcion,
                        'imagen_url': imagen_url,
                        'fuente': 'Marpico Promocionales'
                    }

                    productos.append(producto)

                except Exception as e:
                    continue

            print(f"     [OK] {len(productos)} productos extraídos")
            return productos

        except Exception as e:
            print(f"     [ERROR] {e}")
            import traceback
            traceback.print_exc()
            return []

    def scrapear_todas_categorias(self):
        """Scrapea todas las categorías"""
        print("\n" + "="*70)
        print("SCRAPING MARPICO PROMOCIONALES - VERSIÓN MEJORADA")
        print("="*70)

        try:
            self.setup_driver()

            print(f"\n[INFO] {len(self.categorias)} categorías a procesar\n")

            for idx, cat_id in enumerate(self.categorias, 1):
                print(f"[{idx}/{len(self.categorias)}] Procesando categoría {cat_id}")

                productos = self.extraer_productos_categoria(cat_id)
                self.productos.extend(productos)

                print(f"     Total acumulado: {len(self.productos)} productos")

                if idx < len(self.categorias):
                    time.sleep(3)

            print("\n" + "="*70)
            print(f"SCRAPING COMPLETADO")
            print(f"Total: {len(self.productos)} productos")
            print("="*70)

        finally:
            self.close_driver()

    def guardar_json(self, filename='productos_marpico_final.json'):
        """Guarda productos en JSON"""
        if not self.productos:
            print("[WARNING] No hay productos")
            return

        output_dir = os.path.join(os.path.dirname(__file__), 'data')
        os.makedirs(output_dir, exist_ok=True)

        output_path = os.path.join(output_dir, filename)

        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(self.productos, f, ensure_ascii=False, indent=2)

        print(f"\n[OK] Guardado: {output_path}")
        print(f"[OK] Total: {len(self.productos)} productos")

        # Estadísticas
        cats = {}
        for p in self.productos:
            cat = p['categoria']
            cats[cat] = cats.get(cat, 0) + 1

        print(f"\nCategorías: {len(cats)}")
        for cat, count in sorted(cats.items(), key=lambda x: x[1], reverse=True):
            print(f"  - {cat}: {count} productos")


def main():
    # headless=False para ver el navegador, True para ejecutar en segundo plano
    scraper = MarpicoScraperMejorado(headless=False)

    try:
        scraper.scrapear_todas_categorias()
        scraper.guardar_json('productos_marpico_final.json')

        print("\n✅ SCRAPING EXITOSO!")
        print("\n📝 Siguiente paso:")
        print("   Copia promo-scraper/data/productos_marpico_final.json a data/products.json")

    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()
