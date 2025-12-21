"""
Script de debug para analizar la estructura del sitio Marpico
"""

import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

# Configurar Chrome
chrome_options = Options()
# chrome_options.add_argument('--headless')  # Comentar para ver el navegador
chrome_options.add_argument('--no-sandbox')
chrome_options.add_argument('--disable-dev-shm-usage')

driver = webdriver.Chrome(options=chrome_options)

try:
    print("Navegando a marpicopromocionales.com/#/portafolio...")
    driver.get("https://marpicopromocionales.com/#/portafolio")

    # Esperar carga
    time.sleep(5)

    # Guardar screenshot
    driver.save_screenshot('debug_screenshot.png')
    print("Screenshot guardado: debug_screenshot.png")

    # Guardar HTML
    with open('debug_html.html', 'w', encoding='utf-8') as f:
        f.write(driver.page_source)
    print("HTML guardado: debug_html.html")

    # Intentar encontrar elementos
    print("\n=== Buscando elementos ===")

    # Buscar todos los divs
    divs = driver.find_elements(By.TAG_NAME, 'div')
    print(f"Total divs encontrados: {len(divs)}")

    # Buscar imágenes
    imgs = driver.find_elements(By.TAG_NAME, 'img')
    print(f"Total imágenes encontradas: {len(imgs)}")

    if imgs:
        print("\nPrimeras 5 imágenes:")
        for i, img in enumerate(imgs[:5], 1):
            src = img.get_attribute('src')
            alt = img.get_attribute('alt')
            print(f"  {i}. src={src[:60] if src else 'N/A'}... alt={alt}")

    # Buscar headers
    for tag in ['h1', 'h2', 'h3', 'h4']:
        headers = driver.find_elements(By.TAG_NAME, tag)
        print(f"Total {tag}: {len(headers)}")
        if headers:
            print(f"  Primeros 3 {tag}:")
            for h in headers[:3]:
                text = h.text.strip()
                if text:
                    print(f"    - {text}")

    # Buscar links
    links = driver.find_elements(By.TAG_NAME, 'a')
    print(f"\nTotal links: {len(links)}")

    # Buscar elementos con clases comunes de productos
    clases_comunes = ['product', 'producto', 'item', 'card', 'col-md', 'col-lg']
    for clase in clases_comunes:
        try:
            elementos = driver.find_elements(By.CSS_SELECTOR, f"[class*='{clase}']")
            if elementos:
                print(f"\nElementos con clase '{clase}': {len(elementos)}")
        except:
            pass

    print("\n=== Análisis completado ===")
    print("Revisa debug_html.html para ver la estructura completa")

finally:
    driver.quit()
