"""
Script de prueba para verificar el scraper con solo 2 páginas
"""
from scraper import PromoScraper

def main():
    print("=== PRUEBA DEL SCRAPER ===")
    print("Extrayendo solo las primeras 2 páginas...\n")

    # Crear instancia del scraper
    scraper = PromoScraper()

    # Scraping de solo 2 páginas para prueba
    scraper.scrape_all_pages(max_pages=2, delay=1)

    # Guardar resultados
    scraper.save_to_csv('productos_test.csv')

    print("\n=== PRUEBA COMPLETADA ===")
    print("Revisa el archivo 'productos_test.csv' para ver los resultados")

if __name__ == "__main__":
    main()
