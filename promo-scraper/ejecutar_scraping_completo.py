"""
Script maestro para ejecutar el scraping completo y preparar datos para Next.js
"""
import subprocess
import sys
import os

def ejecutar_comando(comando, descripcion):
    """Ejecuta un comando y muestra el progreso"""
    print("\n" + "="*70)
    print(f"🚀 {descripcion}")
    print("="*70 + "\n")

    try:
        result = subprocess.run(
            [sys.executable, comando],
            check=True,
            capture_output=False,
            text=True
        )
        print(f"\n✓ {descripcion} completado exitosamente\n")
        return True
    except subprocess.CalledProcessError as e:
        print(f"\n✗ Error en {descripcion}")
        print(f"Código de error: {e.returncode}\n")
        return False
    except Exception as e:
        print(f"\n✗ Error inesperado: {e}\n")
        return False


def main():
    """Ejecuta el proceso completo"""
    print("\n" + "="*70)
    print("🎯 PROCESO COMPLETO DE SCRAPING Y OPTIMIZACIÓN")
    print("="*70)
    print("\nEste script ejecutará:")
    print("1. Scraping de productos desde catalogospromocionales.com")
    print("2. Conversión de datos al formato Next.js")
    print("3. Generación de archivos JSON optimizados para SSG")
    print("\n" + "="*70)

    input("\nPresiona ENTER para comenzar...")

    # Paso 1: Scraping
    if not ejecutar_comando(
        "scraper_subcategorias.py",
        "PASO 1: Scraping de productos"
    ):
        print("⚠ El scraping falló. Revisa los errores anteriores.")
        return

    # Paso 2: Conversión
    if not ejecutar_comando(
        "convertir_a_nextjs.py",
        "PASO 2: Conversión al formato Next.js"
    ):
        print("⚠ La conversión falló. Revisa los errores anteriores.")
        return

    # Resumen final
    print("\n" + "="*70)
    print("✅ PROCESO COMPLETADO EXITOSAMENTE")
    print("="*70)
    print("\n📁 Archivos generados en la carpeta 'data/':")
    print("  • productos_scraped.json - Datos crudos del scraping")
    print("  • products_generated.json - Productos en formato Next.js")
    print("  • categories_generated.json - Categorías generadas")

    print("\n📝 SIGUIENTES PASOS:")
    print("\n1. Revisa los archivos generados en la carpeta 'data/'")
    print("2. Copia o renombra los archivos si deseas reemplazar los actuales:")
    print("   - products_generated.json → products.json")
    print("   - categories_generated.json → categories.json")
    print("\n3. Ejecuta el build de Next.js:")
    print("   cd .. && npm run build")
    print("\n4. Verifica que se generaron las páginas estáticas:")
    print("   - Revisa la carpeta 'out/' después del build")
    print("   - Cada producto debe tener su propia página HTML")

    print("\n🌐 Para desplegar en Netlify:")
    print("   - Configura 'out/' como directorio de publicación")
    print("   - El sitio será 100% estático (SSG)")
    print("   - Perfecto para SEO y carga rápida")

    print("\n" + "="*70 + "\n")


if __name__ == "__main__":
    main()
