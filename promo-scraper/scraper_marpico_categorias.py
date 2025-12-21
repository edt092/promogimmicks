"""
Scraper específico para categorías de Marpico Promocionales
Extrae productos de categorías específicas usando Selenium
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
from typing import List, Dict

class MarpicoCategoriasScraper:
    def __init__(self):
        self.base_url = "https://marpicopromocionales.com"
        self.productos = []
        self.driver = None

        # Categorías específicas a scrapear
        self.categorias = [
            {"id": "30012", "nombre": "Categoría 30012"},
            {"id": "30010", "nombre": "Categoría 30010"},
            {"id": "30004", "nombre": "Categoría 30004"},
            {"id": "30003", "nombre": "Categoría 30003"},
            {"id": "30009", "nombre": "Categoría 30009"},
            {"id": "30008", "nombre": "Categoría 30008"},
            {"id": "30005", "nombre": "Categoría 30005"},
            {"id": "30011", "nombre": "Categoría 30011"},
            {"id": "30007", "nombre": "Categoría 30007"},
            {"id": "30000", "nombre": "Categoría 30000"},
        ]

    def setup_driver(self):
        """Configura el driver de Selenium con opciones optimizadas"""
        print("Configurando driver de Selenium...")
        chrome_options = Options()
        # chrome_options.add_argument('--headless')  # Comentar para ver el navegador
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        chrome_options.add_argument('--disable-gpu')
        chrome_options.add_argument('--window-size=1920,1080')
        chrome_options.add_argument('--disable-blink-features=AutomationControlled')
        chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
        chrome_options.add_experimental_option('useAutomationExtension', False)
        chrome_options.add_argument('user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')

        try:
            self.driver = webdriver.Chrome(options=chrome_options)
            self.driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
            print("[OK] Driver configurado correctamente")
        except Exception as e:
            print(f"[ERROR] No se pudo configurar el driver: {e}")
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

    def extraer_nombre_categoria(self, categoria_id: str) -> str:
        """Intenta extraer el nombre real de la categoría desde la página"""
        try:
            # Intentar encontrar el nombre en el breadcrumb o título
            wait = WebDriverWait(self.driver, 5)

            # Intentar varios selectores
            selectores = [
                "//h1",
                "//h2",
                "//h3[contains(@class, 'titulo')]",
                "//div[contains(@class, 'breadcrumb')]//span[last()]",
                "//nav//li[last()]",
            ]

            for selector in selectores:
                try:
                    elemento = self.driver.find_element(By.XPATH, selector)
                    texto = elemento.text.strip()
                    if texto and len(texto) > 2 and texto != 'PORTAFOLIO DE PRODUCTOS':
                        return texto
                except:
                    continue

        except:
            pass

        return f"Categoría {categoria_id}"

    def extraer_productos_categoria(self, categoria_id: str, max_scroll: int = 10) -> List[Dict]:
        """Extrae productos de una categoría específica"""
        url = f"{self.base_url}/#/productos?categoria={categoria_id}"
        print(f"\n  -> Navegando a categoría {categoria_id}")
        print(f"     URL: {url}")

        productos = []

        try:
            # Navegar a la categoría
            self.driver.get(url)

            # Esperar carga inicial
            time.sleep(5)

            # Intentar extraer nombre de categoría
            nombre_categoria = self.extraer_nombre_categoria(categoria_id)
            print(f"     Categoría: {nombre_categoria}")

            # Scroll para cargar productos lazy-loaded
            print(f"     Haciendo scroll para cargar productos...")
            last_height = self.driver.execute_script("return document.body.scrollHeight")
            scroll_count = 0

            while scroll_count < max_scroll:
                # Scroll down
                self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
                time.sleep(2)

                # Calcular nueva altura
                new_height = self.driver.execute_script("return document.body.scrollHeight")

                if new_height == last_height:
                    break

                last_height = new_height
                scroll_count += 1
                print(f"     Scroll {scroll_count}/{max_scroll}")

            # Scroll de vuelta arriba
            self.driver.execute_script("window.scrollTo(0, 0);")
            time.sleep(2)

            # Intentar encontrar productos con múltiples estrategias
            print(f"     Buscando productos...")

            # Estrategia 1: Buscar por estructura Angular común
            elementos_producto = []

            selectores_xpath = [
                "//app-producto-card",
                "//div[contains(@class, 'producto-card')]",
                "//div[contains(@class, 'product-card')]",
                "//*[contains(@class, 'card') and .//img[contains(@src, 'marpicostorage')]]",
                "//div[contains(@class, 'col') and .//img[contains(@src, 'marpicostorage')]]",
            ]

            for selector in selectores_xpath:
                try:
                    elementos = self.driver.find_elements(By.XPATH, selector)
                    if len(elementos) > len(elementos_producto):
                        elementos_producto = elementos
                        print(f"     Selector exitoso: {selector} ({len(elementos)} elementos)")
                except:
                    continue

            if not elementos_producto:
                # Estrategia 2: Buscar todas las imágenes de productos
                print(f"     Estrategia alternativa: buscando imágenes de productos...")
                imagenes = self.driver.find_elements(By.XPATH, "//img[contains(@src, 'marpicostorage') and contains(@src, 'productos')]")
                elementos_producto = [img.find_element(By.XPATH, "./ancestor::div[contains(@class, 'col') or contains(@class, 'card')][1]") for img in imagenes]

            print(f"     Encontrados {len(elementos_producto)} elementos de producto")

            seen_productos = set()

            for idx, elemento in enumerate(elementos_producto):
                try:
                    # Scroll al elemento para asegurar que esté visible
                    self.driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", elemento)
                    time.sleep(0.3)

                    # Extraer imagen
                    imagen_url = ''
                    try:
                        img = elemento.find_element(By.TAG_NAME, 'img')
                        imagen_url = img.get_attribute('src') or img.get_attribute('data-src') or ''

                        # Convertir a URL absoluta
                        if imagen_url and not imagen_url.startswith('http'):
                            imagen_url = f"{self.base_url}/{imagen_url.lstrip('/')}"
                    except:
                        pass

                    # Si no hay imagen de producto, saltar
                    if not imagen_url or 'placeholder' in imagen_url.lower():
                        continue

                    # Extraer nombre del producto
                    nombre = None
                    try:
                        # Buscar en el alt de la imagen primero
                        if img:
                            nombre = img.get_attribute('alt') or img.get_attribute('title')

                        # Si no hay nombre en la imagen, buscar en headers
                        if not nombre or len(nombre) < 3:
                            for tag in ['h1', 'h2', 'h3', 'h4', 'h5', 'p', 'span', 'div']:
                                try:
                                    elem = elemento.find_element(By.TAG_NAME, tag)
                                    texto = elem.text.strip()
                                    if texto and len(texto) > 3 and texto not in ['Ver más', 'Cotizar', 'Agregar']:
                                        nombre = texto
                                        break
                                except:
                                    continue
                    except:
                        pass

                    if not nombre or len(nombre) < 3:
                        # Usar nombre desde la URL de la imagen
                        try:
                            nombre_desde_url = imagen_url.split('/')[-1].split('.')[0]
                            nombre = nombre_desde_url.replace('_', ' ').replace('-', ' ').title()
                        except:
                            continue

                    # Evitar duplicados
                    nombre_key = nombre.lower().strip()
                    if nombre_key in seen_productos:
                        continue
                    seen_productos.add(nombre_key)

                    # Extraer descripción si existe
                    descripcion = ''
                    try:
                        desc_elem = elemento.find_element(By.XPATH, ".//p[not(contains(@class, 'precio'))]")
                        descripcion = desc_elem.text.strip()[:200]
                    except:
                        pass

                    if not descripcion:
                        descripcion = f"{nombre} personalizado con logo. Producto promocional de alta calidad."

                    # Limpiar y procesar nombre
                    nombre_limpio = self.limpiar_nombre(nombre)
                    slug = self.generar_slug(nombre_limpio)
                    producto_id = self.generar_slug(f"{nombre_categoria}-{nombre_limpio}")[:60]

                    # Crear producto
                    producto = {
                        'id': producto_id,
                        'nombre': nombre_limpio,
                        'nombre_original': nombre,
                        'slug': slug,
                        'categoria': nombre_categoria,
                        'categoria_id': categoria_id,
                        'categoria_slug': self.generar_slug(nombre_categoria),
                        'descripcion_corta': descripcion,
                        'imagen_url': imagen_url,
                        'fuente': 'Marpico Promocionales'
                    }

                    productos.append(producto)

                    if (idx + 1) % 10 == 0:
                        print(f"     Procesados {idx + 1}/{len(elementos_producto)} elementos")

                except Exception as e:
                    continue

            print(f"     [OK] {len(productos)} productos únicos extraídos")
            return productos

        except Exception as e:
            print(f"     [ERROR] No se pudieron extraer productos: {e}")
            import traceback
            traceback.print_exc()
            return []

    def scrapear_todas_categorias(self):
        """Ejecuta el scraping de todas las categorías"""
        print("\n" + "="*70)
        print("INICIANDO SCRAPING DE CATEGORÍAS MARPICO")
        print("="*70)

        try:
            self.setup_driver()

            total_categorias = len(self.categorias)
            print(f"\n[INFO] Procesando {total_categorias} categorías\n")

            for idx, categoria in enumerate(self.categorias, 1):
                print(f"[{idx}/{total_categorias}] Categoría ID: {categoria['id']}")

                productos = self.extraer_productos_categoria(categoria['id'])
                self.productos.extend(productos)

                print(f"     Total acumulado: {len(self.productos)} productos")

                # Delay entre categorías
                if idx < total_categorias:
                    time.sleep(3)

            print("\n" + "="*70)
            print(f"SCRAPING COMPLETADO")
            print(f"Total productos extraídos: {len(self.productos)}")

            # Estadísticas por categoría
            categorias_count = {}
            for p in self.productos:
                cat = p['categoria']
                categorias_count[cat] = categorias_count.get(cat, 0) + 1

            print(f"Total categorías con productos: {len(categorias_count)}")
            print("\nProductos por categoría:")
            for cat, count in sorted(categorias_count.items(), key=lambda x: x[1], reverse=True):
                print(f"  - {cat}: {count} productos")

            print("="*70 + "\n")

        except Exception as e:
            print(f"[ERROR] Error durante el scraping: {e}")
            import traceback
            traceback.print_exc()
        finally:
            self.close_driver()

    def guardar_json(self, filename: str = 'productos_marpico_completo.json'):
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

        # Mostrar muestra
        print("\n--- MUESTRA DE PRODUCTOS ---")
        for producto in self.productos[:5]:
            print(f"\n* {producto['nombre']}")
            print(f"  Categoría: {producto['categoria']}")
            print(f"  Imagen: {producto['imagen_url'][:80]}...")


def main():
    """Función principal"""
    scraper = MarpicoCategoriasScraper()

    try:
        # Ejecutar scraping
        scraper.scrapear_todas_categorias()

        # Guardar resultados
        scraper.guardar_json('productos_marpico_completo.json')

        print("\n[SUCCESS] Scraping completado exitosamente!")
        print("\nPara usar estos productos en tu tienda:")
        print("1. Copia promo-scraper/data/productos_marpico_completo.json")
        print("2. Pégalo en data/products.json")
        print("3. Reinicia el servidor de desarrollo")

    except Exception as e:
        print(f"\n[FATAL ERROR] {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()
