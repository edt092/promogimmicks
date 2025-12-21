import json
import os
import shutil
from datetime import datetime

def hacer_backup():
    """Crea backup de los archivos actuales"""
    data_dir = os.path.join(os.path.dirname(__file__), '..', 'data')
    backup_dir = os.path.join(data_dir, 'backups')
    os.makedirs(backup_dir, exist_ok=True)

    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')

    # Backup de products.json
    products_path = os.path.join(data_dir, 'products.json')
    if os.path.exists(products_path):
        backup_path = os.path.join(backup_dir, f'products_backup_{timestamp}.json')
        shutil.copy2(products_path, backup_path)
        print(f"[BACKUP] products.json -> {backup_path}")

    # Backup de categories.json
    categories_path = os.path.join(data_dir, 'categories.json')
    if os.path.exists(categories_path):
        backup_path = os.path.join(backup_dir, f'categories_backup_{timestamp}.json')
        shutil.copy2(categories_path, backup_path)
        print(f"[BACKUP] categories.json -> {backup_path}")


def aplicar_productos():
    """Aplica los productos mergeados como datos principales"""
    data_dir = os.path.join(os.path.dirname(__file__), '..', 'data')

    # Leer productos mergeados
    merged_path = os.path.join(data_dir, 'products_merged.json')
    with open(merged_path, 'r', encoding='utf-8') as f:
        productos = json.load(f)

    # Escribir como products.json principal
    products_path = os.path.join(data_dir, 'products.json')
    with open(products_path, 'w', encoding='utf-8') as f:
        json.dump(productos, f, ensure_ascii=False, indent=2)

    print(f"[OK] {len(productos)} productos aplicados a products.json")


def mostrar_estadisticas():
    """Muestra estadísticas de los productos"""
    data_dir = os.path.join(os.path.dirname(__file__), '..', 'data')
    products_path = os.path.join(data_dir, 'products.json')

    with open(products_path, 'r', encoding='utf-8') as f:
        productos = json.load(f)

    # Estadísticas por categoría
    stats = {}
    for producto in productos:
        cat = producto.get('categoryId', 'sin-categoria')
        stats[cat] = stats.get(cat, 0) + 1

    print("\n" + "="*70)
    print("ESTADÍSTICAS DE PRODUCTOS")
    print("="*70)
    print(f"Total productos: {len(productos)}")
    print("\nProductos por categoría:")
    for cat, count in sorted(stats.items(), key=lambda x: x[1], reverse=True):
        print(f"  {cat}: {count} productos")

    # Verificar imágenes
    con_imagenes = sum(1 for p in productos if p.get('images') and len(p['images']) > 0)
    print(f"\nProductos con imágenes: {con_imagenes}/{len(productos)}")

    print("\n" + "="*70)


def main():
    """Función principal"""
    print("\n" + "="*70)
    print("APLICAR PRODUCTOS SCRAPEADOS")
    print("="*70)

    # Hacer backup
    print("\n1. Creando backup de datos actuales...")
    hacer_backup()

    # Aplicar nuevos productos
    print("\n2. Aplicando productos mergeados...")
    aplicar_productos()

    # Mostrar estadísticas
    print("\n3. Estadísticas:")
    mostrar_estadisticas()

    print("\n" + "="*70)
    print("SIGUIENTE PASO:")
    print("="*70)
    print("\n Ejecuta el build de Next.js para generar páginas estáticas:")
    print("\n   cd ..")
    print("   npm run build")
    print("\nEsto generará HTML estático para cada uno de los 1,172 productos.")
    print("="*70 + "\n")


if __name__ == "__main__":
    main()
