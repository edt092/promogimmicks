"""
Scraper para Marpico Promocionales
Extrae productos de todas las categorías de https://marpicopromocionales.com/#/portafolio
Usa Selenium para manejar contenido JavaScript/SPA
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

class MarpicoScraper:
    def __init__(self):
        self.base_url = "https://marpicopromocionales.com"
        self.productos = []
        self.categorias = []
        self.driver = None

    def setup_driver(self):
        """Configura el driver de Selenium"""
        print("Configurando driver de Selenium...")
        chrome_options = Options()
        chrome_options.add_argument('--headless')  # Ejecutar sin interfaz gráfica
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        chrome_options.add_argument('--disable-gpu')
        chrome_options.add_argument('--window-size=1920,1080')
        chrome_options.add_argument('user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')

        try:
            self.driver = webdriver.Chrome(options=chrome_options)
            print("[OK] Driver configurado correctamente")
        except Exception as e:
            print(f"[ERROR] No se pudo configurar el driver: {e}")
            print("Asegúrate de tener ChromeDriver instalado")
            raise

    def close_driver(self):
        """Cierra el driver de Selenium"""
        if self.driver:
            self.driver.quit()
            print("[OK] Driver cerrado")

    def generar_slug(self, texto: str) -> str:
        """Genera un slug SEO-friendly"""
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
        nombre = re.sub(r'\([^)]*\)', '', nombre)
        nombre = re.sub(r'\[[^\]]*\]', '', nombre)
        nombre = re.sub(r'\s+', ' ', nombre).strip()

        palabras = nombre.split()
        nombre_limpio = ' '.join([
            palabra.capitalize() if len(palabra) > 2 else palabra.lower()
            for palabra in palabras
        ])

        return nombre_limpio

    def extraer_categorias(self) -> List[Dict]:
        """Extrae todas las categorías del portafolio"""
        print("\n" + "="*70)
        print("EXTRAYENDO CATEGORÍAS")
        print("="*70)

        try:
            # Navegar al portafolio
            print(f"Navegando a {self.base_url}/#/portafolio")
            self.driver.get(f"{self.base_url}/#/portafolio")

            # Esperar a que cargue el contenido
            time.sleep(3)

            # Intentar encontrar categorías - adaptar selectores según la estructura real del sitio
            # Estos son selectores comunes, puede que necesiten ajuste
            wait = WebDriverWait(self.driver, 10)

            # Intentar varios selectores posibles
            selectores_categorias = [
                "//a[contains(@href, '#/portafolio/')]",
                "//div[contains(@class, 'categoria')]//a",
                "//div[contains(@class, 'category')]//a",
                "//nav//a[contains(@href, 'categoria')]",
                "//button[contains(@class, 'categoria')]",
                "//a[contains(@class, 'category-link')]",
            ]

            categorias_encontradas = set()

            for selector in selectores_categorias:
                try:
                    elementos = self.driver.find_elements(By.XPATH, selector)
                    for elem in elementos:
                        try:
                            nombre = elem.text.strip()
                            href = elem.get_attribute('href') or ''

                            if nombre and len(nombre) > 2:
                                categorias_encontradas.add((nombre, href))
                        except:
                            continue
                except:
                    continue

            self.categorias = list(categorias_encontradas)

            # Si no se encontraron categorías con los selectores, intentar extraer todas las cards/productos directamente
            if len(self.categorias) == 0:
                print("[INFO] No se encontraron categorías específicas, buscando productos directamente...")
                return [("Todos los productos", f"{self.base_url}/#/portafolio")]

            print(f"[OK] Encontradas {len(self.categorias)} categorías")
            for nombre, _ in self.categorias[:5]:
                print(f"  - {nombre}")
            if len(self.categorias) > 5:
                print(f"  ... y {len(self.categorias) - 5} más")

            return self.categorias

        except Exception as e:
            print(f"[ERROR] No se pudieron extraer categorías: {e}")
            # Fallback: usar la página principal del portafolio
            return [("Todos los productos", f"{self.base_url}/#/portafolio")]

    def extraer_productos_pagina(self, categoria_nombre: str, url: str, max_productos: int = 200) -> List[Dict]:
        """Extrae productos de una categoría/página específica"""
        print(f"\n  -> Extrayendo productos de '{categoria_nombre}'")

        productos = []

        try:
            # Navegar a la URL
            self.driver.get(url)
            time.sleep(3)  # Esperar carga de contenido dinámico

            # Scroll para cargar productos lazy-loaded
            last_height = self.driver.execute_script("return document.body.scrollHeight")
            scroll_attempts = 0
            max_scrolls = 5

            while scroll_attempts < max_scrolls:
                self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
                time.sleep(2)
                new_height = self.driver.execute_script("return document.body.scrollHeight")

                if new_height == last_height:
                    break

                last_height = new_height
                scroll_attempts += 1

            # Intentar varios selectores para encontrar productos
            selectores_productos = [
                "//div[contains(@class, 'producto')]",
                "//div[contains(@class, 'product')]",
                "//div[contains(@class, 'item')]",
                "//article[contains(@class, 'product')]",
                "//div[contains(@class, 'card')]",
                "//div[@class='col-md-4']",  # Bootstrap cards
                "//div[@class='col-lg-3']",
            ]

            elementos_producto = []
            for selector in selectores_productos:
                try:
                    elementos = self.driver.find_elements(By.XPATH, selector)
                    if len(elementos) > len(elementos_producto):
                        elementos_producto = elementos
                except:
                    continue

            print(f"    Encontrados {len(elementos_producto)} elementos de producto potenciales")

            seen_productos = set()

            for idx, elemento in enumerate(elementos_producto[:max_productos]):
                try:
                    # Extraer nombre del producto
                    nombre = None
                    try:
                        # Intentar varios selectores para el nombre
                        for tag in ['h1', 'h2', 'h3', 'h4', 'h5', '.product-name', '.producto-nombre']:
                            try:
                                if tag.startswith('.'):
                                    nombre_elem = elemento.find_element(By.CSS_SELECTOR, tag)
                                else:
                                    nombre_elem = elemento.find_element(By.TAG_NAME, tag)
                                nombre = nombre_elem.text.strip()
                                if nombre:
                                    break
                            except:
                                continue
                    except:
                        pass

                    if not nombre or len(nombre) < 3:
                        # Intentar extraer de alt de imagen
                        try:
                            img = elemento.find_element(By.TAG_NAME, 'img')
                            nombre = img.get_attribute('alt') or img.get_attribute('title')
                        except:
                            pass

                    if not nombre or len(nombre) < 3:
                        continue

                    # Evitar duplicados
                    nombre_key = nombre.lower()
                    if nombre_key in seen_productos:
                        continue
                    seen_productos.add(nombre_key)

                    # Extraer imagen
                    imagen_url = ''
                    try:
                        img = elemento.find_element(By.TAG_NAME, 'img')
                        imagen_url = img.get_attribute('src') or img.get_attribute('data-src') or ''

                        # Convertir a URL absoluta si es relativa
                        if imagen_url and not imagen_url.startswith('http'):
                            imagen_url = f"{self.base_url}/{imagen_url.lstrip('/')}"
                    except:
                        pass

                    # Extraer descripción si está disponible
                    descripcion = ''
                    try:
                        desc_elem = elemento.find_element(By.CSS_SELECTOR, '.description, .descripcion, p')
                        descripcion = desc_elem.text.strip()[:300]
                    except:
                        pass

                    # Limpiar y procesar nombre
                    nombre_limpio = self.limpiar_nombre(nombre)
                    slug = self.generar_slug(nombre_limpio)
                    producto_id = self.generar_slug(f"{categoria_nombre}-{nombre_limpio}")[:60]

                    # Crear producto
                    producto = {
                        'id': producto_id,
                        'nombre': nombre_limpio,
                        'nombre_original': nombre,
                        'slug': slug,
                        'categoria': categoria_nombre,
                        'categoria_slug': self.generar_slug(categoria_nombre),
                        'descripcion_corta': descripcion or f"{nombre_limpio} personalizado",
                        'imagen_url': imagen_url,
                        'fuente': 'Marpico Promocionales'
                    }

                    productos.append(producto)

                except Exception as e:
                    continue

            print(f"     [OK] {len(productos)} productos únicos extraídos")
            return productos

        except Exception as e:
            print(f"     [ERROR] No se pudieron extraer productos: {e}")
            return []

    def scrapear_todo(self, max_categorias: int = None, max_productos_por_cat: int = 200):
        """Ejecuta el scraping completo"""
        print("\n" + "="*70)
        print("INICIANDO SCRAPING DE MARPICO PROMOCIONALES")
        print("="*70)

        try:
            self.setup_driver()

            # Extraer categorías
            categorias = self.extraer_categorias()

            if max_categorias:
                categorias = categorias[:max_categorias]

            print(f"\n[INFO] Procesando {len(categorias)} categoría(s)")

            # Procesar cada categoría
            for idx, (nombre, url) in enumerate(categorias, 1):
                print(f"\n[{idx}/{len(categorias)}] {nombre}")
                productos = self.extraer_productos_pagina(nombre, url, max_productos_por_cat)
                self.productos.extend(productos)

                time.sleep(2)  # Delay entre categorías

            print("\n" + "="*70)
            print(f"SCRAPING COMPLETADO")
            print(f"Total productos extraídos: {len(self.productos)}")
            categorias_unicas = len(set(p['categoria'] for p in self.productos))
            print(f"Total categorías: {categorias_unicas}")
            print("="*70 + "\n")

        except Exception as e:
            print(f"[ERROR] Error durante el scraping: {e}")
            raise
        finally:
            self.close_driver()

    def guardar_json(self, filename: str = 'productos_marpico.json'):
        """Guarda los productos en formato JSON"""
        if not self.productos:
            print("[WARNING] No hay productos para guardar")
            return

        # Crear directorio data si no existe
        output_dir = os.path.join(os.path.dirname(__file__), 'data')
        os.makedirs(output_dir, exist_ok=True)

        output_path = os.path.join(output_dir, filename)

        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(self.productos, f, ensure_ascii=False, indent=2)

        print(f"[OK] Datos guardados en: {output_path}")
        print(f"[OK] Total productos: {len(self.productos)}")

        # Estadísticas
        categorias_count = {}
        for p in self.productos:
            cat = p['categoria']
            categorias_count[cat] = categorias_count.get(cat, 0) + 1

        print(f"[OK] Categorías únicas: {len(categorias_count)}")

        if categorias_count:
            print("\nProductos por categoría:")
            for cat, count in sorted(categorias_count.items(), key=lambda x: x[1], reverse=True):
                print(f"  - {cat}: {count} productos")

        # Mostrar muestra
        print("\n--- MUESTRA DE PRODUCTOS ---")
        for producto in self.productos[:3]:
            print(f"\n* {producto['nombre']}")
            print(f"  Categoría: {producto['categoria']}")
            print(f"  Imagen: {producto['imagen_url'][:60]}...")


def main():
    """Función principal"""
    scraper = MarpicoScraper()

    try:
        # Configuración
        MAX_CATEGORIAS = None  # None = todas las categorías
        MAX_PRODUCTOS_POR_CATEGORIA = 200

        # Ejecutar scraping
        scraper.scrapear_todo(
            max_categorias=MAX_CATEGORIAS,
            max_productos_por_cat=MAX_PRODUCTOS_POR_CATEGORIA
        )

        # Guardar resultados
        scraper.guardar_json('productos_marpico.json')

        print("\n[SUCCESS] Scraping completado exitosamente!")

    except Exception as e:
        print(f"\n[FATAL ERROR] {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()
