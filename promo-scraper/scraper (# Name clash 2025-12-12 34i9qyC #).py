import requests
from bs4 import BeautifulSoup
import pandas as pd
import time
import re
from urllib.parse import urljoin

class PromoScraper:
    def __init__(self, base_url="https://www.catalogospromocionales.com/promocionales/articulos-escritura.html"):
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        self.products = []

    def get_page(self, page_num=None):
        """Obtiene el contenido de una página específica"""
        if page_num and page_num > 1:
            url = f"https://www.catalogospromocionales.com/Catalogo/Default.aspx?id=253&Page={page_num}"
        else:
            url = self.base_url

        try:
            response = self.session.get(url, timeout=10)
            response.raise_for_status()
            return response.text
        except requests.RequestException as e:
            print(f"Error al obtener página {page_num if page_num else 1}: {e}")
            return None

    def extract_number(self, text):
        """Extrae números de un texto, manejando formato con comas"""
        if not text:
            return 0
        # Eliminar comas y extraer números
        numbers = re.findall(r'[\d,]+', text)
        if numbers:
            return int(numbers[0].replace(',', ''))
        return 0

    def parse_product(self, product_div):
        """Extrae información de un producto individual"""
        try:
            product_data = {
                'nombre': '',
                'referencia': '',
                'existencias': 0,
                'proximas_llegadas': 0,
                'imagen_url': '',
                'producto_url': '',
                'producto_id': ''
            }

            # Obtener el enlace del producto y la imagen
            link = product_div.find('a', href=True)
            if link:
                product_data['producto_url'] = urljoin(self.base_url, link['href'])
                # Extraer ID del producto de la URL
                id_match = re.search(r'/(\d+)/', link['href'])
                if id_match:
                    product_data['producto_id'] = id_match.group(1)

            # Obtener imagen
            img = product_div.find('img')
            if img and img.get('src'):
                product_data['imagen_url'] = urljoin('https://catalogospromocionales.com', img['src'])

            # Obtener nombre del producto (en h3)
            h3 = product_div.find('h3')
            if h3:
                # Extraer solo el texto, excluyendo el enlace [Más]
                nombre_text = h3.get_text(separator=' ', strip=True)
                product_data['nombre'] = nombre_text.replace('[Más]', '').strip()

            # Obtener todos los párrafos
            paragraphs = product_div.find_all('p')

            # Buscar referencia: el primer párrafo que no tiene strong y no está vacío
            for p in paragraphs:
                # Si no tiene strong dentro, es probablemente la referencia
                if not p.find('strong'):
                    text = p.get_text(strip=True)
                    if text and len(text) > 0 and len(text) < 50:
                        # Asignar solo si no tenemos referencia aún
                        if not product_data['referencia']:
                            product_data['referencia'] = text

            # Buscar existencias y próximas llegadas
            for p in paragraphs:
                text = p.get_text(strip=True)

                # Verificar si contiene "Existencias"
                if 'Existencias' in text:
                    product_data['existencias'] = self.extract_number(text)

                # Verificar si contiene "Próximas llegadas"
                elif 'Próximas llegadas' in text or 'proximas llegadas' in text.lower():
                    product_data['proximas_llegadas'] = self.extract_number(text)

            return product_data

        except Exception as e:
            print(f"Error al parsear producto: {e}")
            return None

    def scrape_page(self, page_num=None):
        """Extrae productos de una página"""
        html_content = self.get_page(page_num)
        if not html_content:
            return 0

        soup = BeautifulSoup(html_content, 'lxml')

        # Encontrar todos los divs que contienen productos
        # Basándonos en la estructura: div > a > img (patrón del producto)
        product_containers = soup.find_all('div', recursive=True)

        # Conjunto para rastrear IDs ya procesados en esta página
        seen_ids = set()
        products_found = 0

        for div in product_containers:
            # Verificar si este div tiene la estructura de un producto
            # Debe tener un enlace con imagen Y un h3
            if div.find('a', href=True) and div.find('img') and div.find('h3'):
                product_data = self.parse_product(div)

                if product_data and product_data['nombre']:
                    # Filtrar elementos no deseados
                    if 'Últimos productos añadidos' in product_data['nombre']:
                        continue

                    # Verificar duplicados por ID de producto
                    if product_data['producto_id']:
                        if product_data['producto_id'] in seen_ids:
                            continue  # Saltar duplicados
                        seen_ids.add(product_data['producto_id'])

                        # Solo agregar productos con URL válida que contenga /p/
                        if '/p/' in product_data['producto_url']:
                            self.products.append(product_data)
                            products_found += 1

        return products_found

    def scrape_all_pages(self, max_pages=24, delay=1):
        """Extrae productos de todas las páginas"""
        print(f"Iniciando scraping de hasta {max_pages} páginas...")

        for page in range(1, max_pages + 1):
            print(f"Procesando página {page}/{max_pages}...", end=' ')
            count = self.scrape_page(page if page > 1 else None)
            print(f"{count} productos encontrados")

            if count == 0 and page > 1:
                print(f"No se encontraron más productos. Deteniendo en página {page}")
                break

            # Esperar entre requests para no sobrecargar el servidor
            if page < max_pages:
                time.sleep(delay)

        print(f"\nTotal de productos extraídos: {len(self.products)}")

    def save_to_csv(self, filename='productos_promocionales.csv'):
        """Guarda los productos en un archivo CSV"""
        if not self.products:
            print("No hay productos para guardar")
            return

        df = pd.DataFrame(self.products)
        df.to_csv(filename, index=False, encoding='utf-8-sig')
        print(f"Datos guardados en {filename}")

        # Mostrar resumen
        print("\n=== RESUMEN ===")
        print(f"Total productos: {len(df)}")
        print(f"Total existencias: {df['existencias'].sum():,}")
        print(f"\nPrimeros 5 productos:")
        print(df[['nombre', 'referencia', 'existencias']].head())


def main():
    # Crear instancia del scraper
    scraper = PromoScraper()

    # Scraping de todas las páginas (puedes limitar el número si quieres probar primero)
    # Para prueba rápida usa: scraper.scrape_all_pages(max_pages=2)
    scraper.scrape_all_pages(max_pages=24, delay=1)

    # Guardar resultados
    scraper.save_to_csv('productos_promocionales.csv')


if __name__ == "__main__":
    main()
