"""
Pipeline Completo de Scraping y Generación de Contenido
Ejecuta todo el proceso en secuencia:
1. Scraping avanzado
2. Generación de SEO
3. Conversión a formato Next.js
"""

import os
import sys
import subprocess
import time
from datetime import datetime


def imprimir_banner(texto: str):
    """Imprime un banner decorativo"""
    ancho = 70
    print("\n" + "="*ancho)
    print(f"{texto:^{ancho}}")
    print("="*ancho + "\n")


def ejecutar_script(script_nombre: str, descripcion: str) -> bool:
    """Ejecuta un script de Python y retorna True si fue exitoso"""
    imprimir_banner(f"PASO: {descripcion}")

    script_dir = os.path.dirname(__file__)
    script_path = os.path.join(script_dir, script_nombre)

    if not os.path.exists(script_path):
        print(f"[ERROR] No se encontró el script: {script_path}")
        return False

    print(f"[INFO] Ejecutando: {script_nombre}")
    print(f"[INFO] Hora de inicio: {datetime.now().strftime('%H:%M:%S')}\n")

    start_time = time.time()

    try:
        # Ejecutar el script usando Python
        result = subprocess.run(
            [sys.executable, script_path],
            cwd=script_dir,
            capture_output=False,
            text=True
        )

        elapsed_time = time.time() - start_time
        print(f"\n[INFO] Tiempo transcurrido: {elapsed_time:.2f} segundos")

        if result.returncode == 0:
            print(f"[OK] {descripcion} completado exitosamente")
            return True
        else:
            print(f"[ERROR] {descripcion} falló con código: {result.returncode}")
            return False

    except Exception as e:
        print(f"[ERROR] Excepción al ejecutar {script_nombre}: {e}")
        return False


def verificar_archivos_generados(data_dir: str) -> dict:
    """Verifica qué archivos fueron generados y sus tamaños"""
    archivos = {
        'productos_avanzado.json': 'Productos scrapeados',
        'productos_con_seo.json': 'Productos con SEO',
        'products.json': 'Productos Next.js',
        'categories.json': 'Categorías Next.js'
    }

    print("\n" + "="*70)
    print("VERIFICACIÓN DE ARCHIVOS GENERADOS")
    print("="*70 + "\n")

    resultados = {}

    for archivo, descripcion in archivos.items():
        ruta = os.path.join(data_dir, archivo)
        if os.path.exists(ruta):
            tamaño_kb = os.path.getsize(ruta) / 1024
            print(f"[OK] {descripcion}")
            print(f"     Archivo: {archivo}")
            print(f"     Tamaño: {tamaño_kb:.2f} KB\n")
            resultados[archivo] = True
        else:
            print(f"[FALTA] {descripcion}")
            print(f"        Archivo: {archivo}\n")
            resultados[archivo] = False

    return resultados


def main():
    """Función principal que ejecuta el pipeline completo"""
    imprimir_banner("PIPELINE COMPLETO DE GENERACIÓN DE CONTENIDO")

    print("Este script ejecutará:")
    print("  1. Scraping avanzado de productos")
    print("  2. Generación de contenido SEO único")
    print("  3. Conversión a formato Next.js")
    print("\nEsto puede tardar varios minutos...\n")

    # Confirmar ejecución
    respuesta = input("¿Deseas continuar? (s/n): ").lower().strip()
    if respuesta != 's':
        print("\n[INFO] Operación cancelada por el usuario")
        return

    script_dir = os.path.dirname(__file__)
    data_dir = os.path.join(script_dir, '..', 'data')

    # Verificar que existe el directorio de datos
    if not os.path.exists(data_dir):
        os.makedirs(data_dir, exist_ok=True)
        print(f"[INFO] Creado directorio: {data_dir}")

    inicio_total = time.time()

    # PASO 1: Scraping avanzado
    # Comentar esta línea si ya tienes productos scrapeados y solo quieres regenerar SEO
    success_scraping = ejecutar_script('scraper_avanzado.py', 'Scraping Avanzado')

    if not success_scraping:
        print("\n[WARNING] El scraping falló, intentando continuar con datos existentes...")
        # Verificar si existe un archivo de productos previo
        archivo_previo = os.path.join(data_dir, 'productos_scraped_completo.json')
        if not os.path.exists(archivo_previo):
            print("[ERROR] No hay datos de productos disponibles. Abortando.")
            return

    # PASO 2: Generación de SEO
    success_seo = ejecutar_script('generador_seo_avanzado.py', 'Generación de Contenido SEO')

    if not success_seo:
        print("\n[ERROR] La generación de SEO falló. Abortando.")
        return

    # PASO 3: Conversión a Next.js
    success_conversion = ejecutar_script('convertir_a_nextjs_optimizado.py', 'Conversión a Next.js')

    if not success_conversion:
        print("\n[ERROR] La conversión a Next.js falló. Abortando.")
        return

    # Verificación final
    verificar_archivos_generados(data_dir)

    tiempo_total = time.time() - inicio_total

    # Resumen final
    imprimir_banner("PIPELINE COMPLETADO")

    print(f"Tiempo total: {tiempo_total/60:.2f} minutos")
    print(f"Hora de finalización: {datetime.now().strftime('%H:%M:%S')}")

    print("\n" + "="*70)
    print("PRÓXIMOS PASOS")
    print("="*70)
    print("\n1. Verifica los archivos generados en la carpeta 'data/'")
    print("2. Ejecuta el build de Next.js:")
    print("   cd kspromocionales-tienda")
    print("   npm run build")
    print("\n3. Para probar localmente:")
    print("   npm run dev")
    print("\n4. Para desplegar en Netlify:")
    print("   - Asegúrate de que next.config.js esté optimizado")
    print("   - Haz commit de los cambios")
    print("   - Despliega en Netlify")
    print("\n" + "="*70 + "\n")


if __name__ == "__main__":
    main()
