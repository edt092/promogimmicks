"""
Scraper para CatalogosPromocionales.com
Extrae productos de todas las categorías y subcategorías
Genera descripciones SEO personalizadas para PromoGimmicks
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
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from typing import List, Dict, Set
from pathlib import Path
import random
from urllib.parse import urljoin

class ScraperCatalogosPromocionales:
    def __init__(self):
        self.base_url = "https://www.catalogospromocionales.com"
        self.productos = []
        self.driver = None
        self.productos_vistos: Set[str] = set()

        # Mapeo de categorías del sitio a nuestras categorías
        self.mapeo_categorias = {
            # Artículos de Escritura
            'boligrafos': 'Artículos de Escritura',
            'boligrafo': 'Artículos de Escritura',
            'lapices': 'Artículos de Escritura',
            'lapiz': 'Artículos de Escritura',
            'estuches': 'Artículos de Escritura',
            'resaltador': 'Artículos de Escritura',
            'metalico': 'Artículos de Escritura',
            'plastico': 'Artículos de Escritura',
            'stylus': 'Artículos de Escritura',
            'ecologico': 'Eco',

            # Confecciones / Textil
            'camiseta': 'Textil y Vestuario',
            'polo': 'Textil y Vestuario',
            'buso': 'Textil y Vestuario',
            'chaqueta': 'Textil y Vestuario',
            'gorra': 'Textil y Vestuario',
            'toalla': 'Textil y Vestuario',
            'delantal': 'Textil y Vestuario',

            # Bolsos y Maletines
            'maletin': 'Bolsos y Mochilas',
            'bolso': 'Bolsos y Mochilas',
            'morral': 'Bolsos y Mochilas',
            'mochila': 'Bolsos y Mochilas',
            'nevera': 'Bolsos y Mochilas',
            'trolley': 'Bolsos y Mochilas',
            'deportivo': 'Bolsos y Mochilas',
            'ejecutivo': 'Bolsos y Mochilas',
            'cambrel': 'Bolsos y Mochilas',
            'algodon': 'Bolsos y Mochilas',

            # Drinkware
            'botella': 'Drinkware',
            'termo': 'Drinkware',
            'mug': 'Drinkware',
            'vaso': 'Drinkware',
            'taza': 'Drinkware',
            'jarra': 'Drinkware',

            # Tecnología
            'usb': 'Tecnología',
            'cargador': 'Tecnología',
            'audifonos': 'Tecnología',
            'parlante': 'Tecnología',
            'power bank': 'Tecnología',
            'mouse': 'Tecnología',
            'teclado': 'Tecnología',
            'hub': 'Tecnología',
            'cable': 'Tecnología',

            # Oficina
            'agenda': 'Oficina',
            'carpeta': 'Oficina',
            'portafolio': 'Oficina',
            'organizador': 'Oficina',
            'calculadora': 'Oficina',
            'clipboard': 'Oficina',
            'portatarjeta': 'Oficina',

            # Hogar
            'cocina': 'Hogar',
            'reloj': 'Hogar',
            'linterna': 'Hogar',
            'herramienta': 'Hogar',
            'cuchillo': 'Hogar',
            'destapador': 'Hogar',

            # Deportes
            'deporte': 'Deportes y Recreación',
            'pelota': 'Deportes y Recreación',
            'balon': 'Deportes y Recreación',
            'fitness': 'Deportes y Recreación',
            'yoga': 'Deportes y Recreación',
            'gimnasio': 'Deportes y Recreación',

            # Accesorios
            'llavero': 'Accesorios',
            'paraguas': 'Accesorios',
            'sombrilla': 'Accesorios',
            'billetera': 'Accesorios',
            'cinturon': 'Accesorios',
            'antifaz': 'Accesorios',
            'espejo': 'Accesorios',
            'porta': 'Accesorios',

            # Salud y Bienestar
            'sanitizante': 'Salud y Bienestar',
            'gel': 'Salud y Bienestar',
            'mascarilla': 'Salud y Bienestar',
            'cubrebocas': 'Salud y Bienestar',
            'kit salud': 'Salud y Bienestar',
        }

        # Directorio para imágenes
        self.img_dir = Path("../public/img/productos")
        self.img_dir.mkdir(parents=True, exist_ok=True)

        # Headers para descargas
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
            'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
        }

        # Templates SEO para PromoGimmicks
        self.templates_seo = {
            'Artículos de Escritura': [
                "{nombre} personalizado con tu logo. Bolígrafo promocional premium para campañas de marketing en Ecuador. Ideal para eventos corporativos y regalos empresariales.",
                "{nombre} corporativo de alta calidad. Artículo de escritura personalizable para tu marca. Cotiza sin compromiso en PromoGimmicks.",
                "Compra {nombre} promocional en Ecuador. Perfecto para ferias, conferencias y activaciones de marca. Personalización profesional garantizada.",
            ],
            'Drinkware': [
                "{nombre} personalizado para tu empresa. Termos y botellas promocionales de alta calidad. Perfecto para campañas de wellness corporativo en Ecuador.",
                "{nombre} con logo de tu marca. Drinkware promocional ecológico y duradero. Ideal para regalos corporativos y merchandising.",
                "Cotiza {nombre} personalizado. Producto promocional de calidad premium. Entrega en Quito, Guayaquil y todo Ecuador.",
            ],
            'Textil y Vestuario': [
                "{nombre} personalizado con bordado o estampado. Uniformes y vestuario corporativo de alta calidad. Ideal para empresas en Ecuador.",
                "{nombre} promocional para tu equipo. Textil corporativo con personalización profesional. Cotiza sin compromiso en PromoGimmicks.",
                "Compra {nombre} con logo de tu empresa. Vestuario promocional para eventos, ferias y activaciones de marca.",
            ],
            'Tecnología': [
                "{nombre} personalizado con logo. Gadget tecnológico promocional de última generación. Regalo corporativo de alto impacto en Ecuador.",
                "{nombre} promocional para tu marca. Tecnología publicitaria que impresiona. Ideal para clientes VIP y ejecutivos.",
                "Cotiza {nombre} con impresión de logo. Tech gift promocional de calidad premium. Entrega rápida en Ecuador.",
            ],
            'Bolsos y Mochilas': [
                "{nombre} personalizado con bordado o serigrafía. Bolso promocional resistente y funcional. Perfecto para eventos corporativos.",
                "{nombre} con logo de tu empresa. Mochila publicitaria de alta calidad. Ideal para regalos empresariales en Ecuador.",
                "Compra {nombre} promocional. Maletín corporativo personalizable. Cotiza en PromoGimmicks para mejores precios.",
            ],
            'Accesorios': [
                "{nombre} personalizado con logo. Accesorio promocional útil y memorable. Regalo corporativo ideal para campañas en Ecuador.",
                "{nombre} publicitario para tu marca. Accesorio práctico con personalización de calidad. Cotiza sin compromiso.",
                "Cotiza {nombre} con impresión de logo. Producto promocional versátil. Perfecto para eventos y ferias empresariales.",
            ],
            'Oficina': [
                "{nombre} personalizado para tu empresa. Artículo de oficina promocional de calidad premium. Ideal para clientes corporativos.",
                "{nombre} con logo de tu marca. Producto de oficina publicitario elegante. Perfecto para regalos ejecutivos en Ecuador.",
                "Compra {nombre} promocional. Artículo de oficina personalizable. Cotiza en PromoGimmicks para entregas rápidas.",
            ],
            'Hogar': [
                "{nombre} personalizado con tu logo. Artículo para el hogar promocional útil y memorable. Regalo corporativo diferente.",
                "{nombre} publicitario para tu marca. Producto para el hogar de alta calidad. Ideal para campañas de fidelización.",
                "Cotiza {nombre} con impresión personalizada. Artículo promocional para el hogar. Entrega en todo Ecuador.",
            ],
            'Deportes y Recreación': [
                "{nombre} personalizado para tu marca. Artículo deportivo promocional de alta calidad. Ideal para campañas de wellness.",
                "{nombre} con logo de tu empresa. Producto deportivo publicitario resistente. Perfecto para eventos deportivos.",
                "Compra {nombre} promocional. Artículo fitness personalizable. Cotiza en PromoGimmicks Ecuador.",
            ],
            'Salud y Bienestar': [
                "{nombre} personalizado con tu logo. Producto de salud promocional responsable. Ideal para campañas de bienestar corporativo.",
                "{nombre} publicitario para tu marca. Artículo de bienestar de alta calidad. Perfecto para empresas conscientes.",
                "Cotiza {nombre} con impresión de logo. Producto promocional de salud. Entrega rápida en Ecuador.",
            ],
            'Eco': [
                "{nombre} ecológico personalizado. Producto promocional sustentable con tu logo. Ideal para empresas responsables en Ecuador.",
                "{nombre} eco-friendly con impresión de marca. Regalo corporativo sustentable. Perfecto para campañas verdes.",
                "Compra {nombre} promocional ecológico. Producto sustentable personalizable. Cotiza en PromoGimmicks.",
            ],
        }

    def setup_driver(self, headless=False):
        """Configura Selenium con técnicas anti-detección"""
        print("Configurando driver de Selenium...")

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
        return texto.strip('-')[:80]

    def determinar_categoria(self, nombre: str, url: str = "") -> str:
        """Determina la categoría basada en el nombre y URL del producto"""
        texto = f"{nombre} {url}".lower()

        for keyword, categoria in self.mapeo_categorias.items():
            if keyword in texto:
                return categoria

        return 'Accesorios'  # Categoría por defecto

    def descargar_imagen(self, url: str, nombre_archivo: str) -> str:
        """Descarga imagen localmente"""
        try:
            # Hacer URL absoluta
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

            return f"/img/productos/{nombre_archivo}"
        except Exception as e:
            print(f"      Error descargando imagen: {e}")
            return "/img/placeholder-producto.svg"

    def generar_seo_description(self, nombre: str, categoria: str) -> str:
        """Genera metadescripción SEO única para PromoGimmicks"""
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
            f"{nombre_lower} corporativo",
            categoria_lower,
            "regalo corporativo ecuador",
            "merchandising quito",
            "productos promocionales guayaquil",
            "promogimmicks",
            "artículos publicitarios",
        ]

        return ', '.join(keywords[:12])

    def limpiar_nombre(self, nombre: str) -> str:
        """Limpia y mejora el nombre del producto"""
        # Eliminar códigos de referencia al inicio
        nombre = re.sub(r'^[A-Z]{1,3}[-_]?\d{3,5}\s*[-:]?\s*', '', nombre)

        # Eliminar precios y caracteres especiales
        nombre = re.sub(r'\$[\d.,]+', '', nombre)
        nombre = re.sub(r'[\(\)\[\]\{\}]', '', nombre)

        # Limpiar espacios
        nombre = ' '.join(nombre.split()).strip()

        # Capitalizar correctamente
        if nombre:
            nombre = ' '.join(word.capitalize() for word in nombre.split())

        return nombre

    def extraer_subcategorias(self) -> List[Dict]:
        """Extrae todas las subcategorías del sitio"""
        url = f"{self.base_url}/seccion/subcategorias.html"
        print(f"\n[INFO] Extrayendo subcategorías de: {url}")

        subcategorias = []

        try:
            self.driver.get(url)
            time.sleep(5)

            # Scroll para cargar todo
            for _ in range(3):
                self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
                time.sleep(1)

            # Buscar enlaces a subcategorías
            enlaces = self.driver.find_elements(By.CSS_SELECTOR, "a[href*='/promocionales/']")

            for enlace in enlaces:
                try:
                    href = enlace.get_attribute('href')
                    texto = enlace.text.strip()

                    if href and '/promocionales/' in href and '.html' in href:
                        # Evitar duplicados
                        if href not in [s['url'] for s in subcategorias]:
                            subcategorias.append({
                                'url': href,
                                'nombre': texto or href.split('/')[-1].replace('.html', '').replace('-', ' ').title()
                            })
                except:
                    continue

            # También buscar en menús desplegables
            menus = self.driver.find_elements(By.CSS_SELECTOR, ".dropdown-menu a, .submenu a, nav a")
            for menu in menus:
                try:
                    href = menu.get_attribute('href')
                    texto = menu.text.strip()

                    if href and '/promocionales/' in href and '.html' in href:
                        if href not in [s['url'] for s in subcategorias]:
                            subcategorias.append({
                                'url': href,
                                'nombre': texto or href.split('/')[-1].replace('.html', '').replace('-', ' ').title()
                            })
                except:
                    continue

            print(f"[OK] {len(subcategorias)} subcategorías encontradas")

            # Si no encontramos subcategorías, usar lista predefinida
            if len(subcategorias) < 5:
                print("[INFO] Usando lista de subcategorías predefinida...")
                subcategorias = self.obtener_subcategorias_predefinidas()

            return subcategorias

        except Exception as e:
            print(f"[ERROR] Error extrayendo subcategorías: {e}")
            return self.obtener_subcategorias_predefinidas()

    def obtener_subcategorias_predefinidas(self) -> List[Dict]:
        """Retorna lista predefinida de subcategorías conocidas"""
        base = self.base_url
        return [
            # Artículos de Escritura
            {'url': f'{base}/promocionales/boligrafos-metalicos-con-stylus.html', 'nombre': 'Bolígrafos Metálicos con Stylus'},
            {'url': f'{base}/promocionales/boligrafos-metalicos-sin-stylus.html', 'nombre': 'Bolígrafos Metálicos sin Stylus'},
            {'url': f'{base}/promocionales/boligrafos-plasticos-con-stylus.html', 'nombre': 'Bolígrafos Plásticos con Stylus'},
            {'url': f'{base}/promocionales/boligrafos-plasticos-sin-stylus.html', 'nombre': 'Bolígrafos Plásticos sin Stylus'},
            {'url': f'{base}/promocionales/boligrafos-con-resaltador.html', 'nombre': 'Bolígrafos con Resaltador'},
            {'url': f'{base}/promocionales/boligrafos-ecologicos.html', 'nombre': 'Bolígrafos Ecológicos'},
            {'url': f'{base}/promocionales/estuches.html', 'nombre': 'Estuches'},
            {'url': f'{base}/promocionales/lapices.html', 'nombre': 'Lápices'},

            # Confecciones
            {'url': f'{base}/promocionales/camisetas-polo.html', 'nombre': 'Camisetas Polo'},
            {'url': f'{base}/promocionales/camisetas-t-shirt.html', 'nombre': 'Camisetas T-Shirt'},
            {'url': f'{base}/promocionales/busos.html', 'nombre': 'Busos'},
            {'url': f'{base}/promocionales/chaquetas.html', 'nombre': 'Chaquetas'},
            {'url': f'{base}/promocionales/gorras.html', 'nombre': 'Gorras'},
            {'url': f'{base}/promocionales/toallas.html', 'nombre': 'Toallas'},
            {'url': f'{base}/promocionales/delantales.html', 'nombre': 'Delantales'},

            # Maletines y Bolsos
            {'url': f'{base}/promocionales/maletines-ejecutivos.html', 'nombre': 'Maletines Ejecutivos'},
            {'url': f'{base}/promocionales/morrales.html', 'nombre': 'Morrales'},
            {'url': f'{base}/promocionales/bolsos-deportivos.html', 'nombre': 'Bolsos Deportivos'},
            {'url': f'{base}/promocionales/bolsos-nevera.html', 'nombre': 'Bolsos Nevera'},
            {'url': f'{base}/promocionales/bolsos-trolley.html', 'nombre': 'Bolsos Trolley'},
            {'url': f'{base}/promocionales/bolsos-cambrel.html', 'nombre': 'Bolsos Cambrel'},
            {'url': f'{base}/promocionales/bolsos-algodon.html', 'nombre': 'Bolsos Algodón'},

            # Drinkware
            {'url': f'{base}/promocionales/botellas.html', 'nombre': 'Botellas'},
            {'url': f'{base}/promocionales/termos.html', 'nombre': 'Termos'},
            {'url': f'{base}/promocionales/mugs.html', 'nombre': 'Mugs'},
            {'url': f'{base}/promocionales/vasos.html', 'nombre': 'Vasos'},
            {'url': f'{base}/promocionales/jarras.html', 'nombre': 'Jarras'},

            # Tecnología
            {'url': f'{base}/promocionales/memorias-usb.html', 'nombre': 'Memorias USB'},
            {'url': f'{base}/promocionales/cargadores.html', 'nombre': 'Cargadores'},
            {'url': f'{base}/promocionales/audifonos.html', 'nombre': 'Audífonos'},
            {'url': f'{base}/promocionales/parlantes.html', 'nombre': 'Parlantes'},
            {'url': f'{base}/promocionales/power-banks.html', 'nombre': 'Power Banks'},

            # Oficina
            {'url': f'{base}/promocionales/agendas.html', 'nombre': 'Agendas'},
            {'url': f'{base}/promocionales/carpetas.html', 'nombre': 'Carpetas'},
            {'url': f'{base}/promocionales/portafolios.html', 'nombre': 'Portafolios'},
            {'url': f'{base}/promocionales/organizadores.html', 'nombre': 'Organizadores'},

            # Accesorios
            {'url': f'{base}/promocionales/llaveros.html', 'nombre': 'Llaveros'},
            {'url': f'{base}/promocionales/paraguas.html', 'nombre': 'Paraguas'},
            {'url': f'{base}/promocionales/sombrillas.html', 'nombre': 'Sombrillas'},

            # Hogar
            {'url': f'{base}/promocionales/relojes.html', 'nombre': 'Relojes'},
            {'url': f'{base}/promocionales/linternas.html', 'nombre': 'Linternas'},
            {'url': f'{base}/promocionales/herramientas.html', 'nombre': 'Herramientas'},

            # Deportes
            {'url': f'{base}/promocionales/articulos-deportivos.html', 'nombre': 'Artículos Deportivos'},
            {'url': f'{base}/promocionales/fitness.html', 'nombre': 'Fitness'},
        ]

    def extraer_productos_subcategoria(self, subcategoria: Dict) -> List[Dict]:
        """Extrae productos de una subcategoría"""
        url = subcategoria['url']
        nombre_subcat = subcategoria['nombre']

        print(f"\n  -> Subcategoría: {nombre_subcat}")
        print(f"     URL: {url}")

        productos = []

        try:
            self.driver.get(url)
            time.sleep(3)

            # Scroll para lazy loading
            for _ in range(5):
                self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
                time.sleep(0.5)

            # Buscar imágenes de productos directamente
            # En este sitio, las imágenes de productos tienen /images/producto en la URL
            # y el nombre del producto está en el atributo alt
            imagenes = self.driver.find_elements(By.TAG_NAME, 'img')

            productos_encontrados = 0

            for img in imagenes:
                try:
                    imagen_url = img.get_attribute('src') or ''
                    alt_text = img.get_attribute('alt') or ''

                    # Solo procesar imágenes de productos
                    if '/images/producto' not in imagen_url.lower():
                        continue

                    # El nombre viene del alt
                    if not alt_text or len(alt_text) < 3:
                        continue

                    # Evitar duplicados
                    if imagen_url in self.productos_vistos:
                        continue
                    self.productos_vistos.add(imagen_url)

                    # Limpiar nombre
                    nombre = self.limpiar_nombre(alt_text)

                    if not nombre or len(nombre) < 3:
                        continue

                    # Determinar categoría
                    categoria = self.determinar_categoria(nombre, url)

                    # Generar slug único
                    slug = self.generar_slug(nombre)

                    # Evitar slugs duplicados
                    slug_count = sum(1 for p in self.productos if p['slug'].startswith(slug))
                    if slug_count > 0:
                        slug = f"{slug}-{slug_count + 1}"

                    # Descargar imagen
                    extension = 'jpg'
                    if '.png' in imagen_url.lower():
                        extension = 'png'
                    nombre_archivo = f"{slug}.{extension}"
                    imagen_local = self.descargar_imagen(imagen_url, nombre_archivo)

                    # Generar SEO
                    seo_description = self.generar_seo_description(nombre, categoria)
                    seo_keywords = self.generar_seo_keywords(nombre, categoria)

                    # Crear producto
                    producto = {
                        'id': slug[:60],
                        'nombre': nombre,
                        'slug': slug,
                        'categoria': categoria,
                        'categoria_slug': self.generar_slug(categoria),
                        'descripcion_corta': seo_description,
                        'imagen_url': imagen_local,
                        'imagen_original_url': imagen_url,
                        'codigo': None,
                        'seo_title': f"{nombre} Personalizado Ecuador | PromoGimmicks",
                        'seo_description': seo_description,
                        'seo_keywords': seo_keywords,
                    }

                    productos.append(producto)
                    productos_encontrados += 1

                except Exception as e:
                    continue

            print(f"     [OK] {productos_encontrados} productos extraídos")
            return productos

        except Exception as e:
            print(f"     [ERROR] {e}")
            return []

    def scrapear_todo(self):
        """Scrapea todas las categorías y subcategorías"""
        print("\n" + "="*70)
        print("SCRAPING CATALOGOS PROMOCIONALES")
        print("="*70)

        try:
            self.setup_driver(headless=False)

            # Intentar cargar subcategorías del archivo JSON primero
            subcategorias = []
            try:
                with open('subcategorias_encontradas.json', 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    subcategorias = [{'url': s['url'], 'nombre': s['text']} for s in data if '/promocionales/' in s['url']]
                    print(f"[INFO] Cargadas {len(subcategorias)} subcategorías del archivo JSON")
            except:
                subcategorias = self.extraer_subcategorias()

            total = len(subcategorias)

            print(f"\n[INFO] {total} subcategorías a procesar\n")

            for idx, subcat in enumerate(subcategorias, 1):
                print(f"[{idx}/{total}] Procesando: {subcat['nombre']}")

                productos = self.extraer_productos_subcategoria(subcat)
                self.productos.extend(productos)

                print(f"     Total acumulado: {len(self.productos)} productos")

                # Delay entre subcategorías
                if idx < total:
                    delay = random.uniform(2, 4)
                    print(f"     Esperando {delay:.1f}s antes de siguiente subcategoría...")
                    time.sleep(delay)

            print("\n" + "="*70)
            print(f"SCRAPING COMPLETADO")
            print(f"Total productos: {len(self.productos)}")
            print("="*70)

        finally:
            self.close_driver()

    def guardar_json(self, filename='productos_catalogos_scraped.json'):
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

        # Estadísticas por categoría
        cats = {}
        for p in self.productos:
            cat = p['categoria']
            cats[cat] = cats.get(cat, 0) + 1

        print(f"\nProductos por categoría:")
        for cat, count in sorted(cats.items(), key=lambda x: -x[1]):
            print(f"  - {cat}: {count} productos")

        # Muestra
        print("\n--- MUESTRA DE PRODUCTOS ---")
        for p in self.productos[:5]:
            print(f"\n* {p['nombre']}")
            if p.get('codigo'):
                print(f"  Código: {p['codigo']}")
            print(f"  Categoría: {p['categoria']}")
            print(f"  Imagen: {p['imagen_url']}")

    def convertir_a_nextjs(self, output_file='../data/products.json'):
        """Convierte productos al formato final de Next.js"""
        if not self.productos:
            print("[WARNING] No hay productos para convertir")
            return

        # Formato limpio para Next.js
        productos_nextjs = []
        for p in self.productos:
            producto = {
                'id': p['id'],
                'nombre': p['nombre'],
                'slug': p['slug'],
                'categoria': p['categoria'],
                'categoria_slug': p['categoria_slug'],
                'descripcion_corta': p['descripcion_corta'],
                'imagen_url': p['imagen_url'],
                'imagen_original_url': p['imagen_original_url'],
                'codigo': p.get('codigo'),
                'seo_title': p['seo_title'],
                'seo_description': p['seo_description'],
                'seo_keywords': p['seo_keywords'],
            }
            productos_nextjs.append(producto)

        output_path = Path(output_file)
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(productos_nextjs, f, ensure_ascii=False, indent=2)

        print(f"\n[OK] Guardado para Next.js: {output_path}")
        print(f"[OK] Total productos: {len(productos_nextjs)}")


def main():
    scraper = ScraperCatalogosPromocionales()

    try:
        scraper.scrapear_todo()
        scraper.guardar_json('productos_catalogos_scraped.json')
        scraper.convertir_a_nextjs('../data/products.json')

        print("\n" + "="*70)
        print("SCRAPING EXITOSO")
        print("="*70)
        print("\nPróximos pasos:")
        print("1. Verifica las imágenes en: public/img/productos/")
        print("2. Revisa el JSON en: promo-scraper/data/productos_catalogos_scraped.json")
        print("3. El archivo data/products.json ya está actualizado")
        print("4. Ejecuta: npm run build")

    except Exception as e:
        print(f"\nERROR: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()
