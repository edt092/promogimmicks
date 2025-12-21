"""
Genera una base de datos ampliada de productos promocionales
Basado en catálogos típicos de la industria
"""

import json
import os

# Productos promocionales organizados por categoría
productos_data = [
    # ARTÍCULOS DE ESCRITURA
    {
        "categoria": "Artículos de Escritura",
        "productos": [
            "Bolígrafo Metálico Premium",
            "Bolígrafo Plástico Económico",
            "Bolígrafo Touch Screen",
            "Lapicero Ejecutivo",
            "Set de Bolígrafos",
            "Portaminas Metálico",
            "Marcador Resaltador",
            "Lápiz Ecológico",
            "Pluma Roller",
            "Bolígrafo de Bambú",
        ]
    },
    # DRINKWARE
    {
        "categoria": "Drinkware",
        "productos": [
            "Mug de Cerámica 11oz",
            "Mug de Cerámica 15oz",
            "Termo de Acero Inoxidable 500ml",
            "Termo de Acero Inoxidable 750ml",
            "Vaso Térmico con Tapa",
            "Botella Deportiva Plástica",
            "Botella de Vidrio",
            "Botella de Aluminio",
            "Jarra Térmica",
            "Taza de Viaje",
        ]
    },
    # TEXTIL Y VESTUARIO
    {
        "categoria": "Textil y Vestuario",
        "productos": [
            "Camiseta Polo de Algodón",
            "Camiseta Cuello Redondo",
            "Sudadera con Capucha",
            "Gorra Trucker",
            "Gorra Snapback",
            "Gorra de Golf",
            "Chaleco Corporativo",
            "Delantal Publicitario",
            "Bufanda Polar",
            "Gorro de Lana",
        ]
    },
    # TECNOLOGÍA
    {
        "categoria": "Tecnología",
        "productos": [
            "USB Metálico 8GB",
            "USB Metálico 16GB",
            "USB Metálico 32GB",
            "Power Bank 5000mAh",
            "Power Bank 10000mAh",
            "Audífonos Bluetooth",
            "Audífonos con Cable",
            "Cable USB Multi-Conector",
            "Cargador Inalámbrico",
            "Mouse Inalámbrico",
        ]
    },
    # BOLSOS Y MOCHILAS
    {
        "categoria": "Bolsos y Mochilas",
        "productos": [
            "Mochila Deportiva",
            "Mochila Ejecutiva",
            "Bolso Messenger",
            "Lonchera Térmica",
            "Bolsa Ecológica",
            "Morral de Tela",
            "Mochila de Cuerdas",
            "Maletín Porta Laptop",
            "Bolsa Plegable",
            "Riñonera Deportiva",
        ]
    },
    # ACCESORIOS
    {
        "categoria": "Accesorios",
        "productos": [
            "Paraguas Automático",
            "Paraguas Plegable",
            "Llavero Metálico",
            "Llavero de Cuero",
            "Porta Tarjetas",
            "Identificador con Cordón",
            "Porta Celular para Auto",
            "Soporte para Tablet",
            "Organizador de Escritorio",
            "Reloj de Pared",
        ]
    },
    # OFICINA
    {
        "categoria": "Oficina",
        "productos": [
            "Libreta Ecológica A5",
            "Libreta Ejecutiva A4",
            "Agenda Anillada",
            "Cuaderno Tapa Dura",
            "Portanotas con Post-it",
            "Calendario de Escritorio",
            "Porta Documentos",
            "Archivador",
            "Organizador de Cables",
            "Mouse Pad",
        ]
    },
    # HOGAR
    {
        "categoria": "Hogar",
        "productos": [
            "Set de Cubiertos",
            "Tabla de Picar",
            "Abridor de Botellas",
            "Destapador Magnético",
            "Sacacorchos",
            "Posavasos Set de 4",
            "Mantel Individual",
            "Individuales de Mesa",
            "Delantal de Cocina",
            "Guantes de Cocina",
        ]
    },
    # DEPORTES Y RECREACIÓN
    {
        "categoria": "Deportes y Recreación",
        "productos": [
            "Pelota de Fútbol",
            "Pelota Anti-Estrés",
            "Toalla Deportiva",
            "Bolsa Impermeable",
            "Botella Deportiva con Infusor",
            "Mat de Yoga",
            "Banda Elástica de Ejercicio",
            "Frisbee Publicitario",
            "Balde Plegable",
            "Silla Plegable Camping",
        ]
    },
    # SALUD Y BIENESTAR
    {
        "categoria": "Salud y Bienestar",
        "productos": [
            "Kit de Primeros Auxilios",
            "Termómetro Digital",
            "Mascarilla Reutilizable",
            "Gel Antibacterial Personalizado",
            "Atomizador Personal",
            "Pastillero Semanal",
            "Toallitas Húmedas",
            "Protector Solar Pocket",
            "Bálsamo Labial",
            "Porta Cubrebocas",
        ]
    },
]

def generar_productos_json():
    """Genera el archivo JSON con todos los productos"""

    productos_finales = []
    producto_id_counter = 1

    for cat_data in productos_data:
        categoria = cat_data["categoria"]
        categoria_slug = categoria.lower().replace(' ', '-').replace('á', 'a').replace('é', 'e').replace('í', 'i').replace('ó', 'o').replace('ú', 'u')

        for nombre in cat_data["productos"]:
            slug = nombre.lower().replace(' ', '-').replace('á', 'a').replace('é', 'e').replace('í', 'i').replace('ó', 'o').replace('ú', 'u')

            # Generar descripción basada en el nombre y categoría
            descripciones = [
                f"{nombre} personalizado con tu logo. Ideal para regalos corporativos y eventos empresariales.",
                f"{nombre} de alta calidad, perfecto para campañas publicitarias y merchandising.",
                f"{nombre} promocional personalizable. Excelente opción para activaciones de marca.",
                f"{nombre} con impresión de logo incluida. Regalo corporativo de impacto.",
            ]

            import random
            descripcion = random.choice(descripciones)

            # Asignar imagen (rotar entre las disponibles)
            imagen_num = (producto_id_counter % 12) + 1
            imagen_url = f"/img/imagenes-de-stock/{imagen_num}.jpg"

            # Precio variable según categoría
            precios_base = {
                "Artículos de Escritura": (1.5, 5.0),
                "Drinkware": (3.0, 15.0),
                "Textil y Vestuario": (5.0, 20.0),
                "Tecnología": (8.0, 25.0),
                "Bolsos y Mochilas": (8.0, 30.0),
                "Accesorios": (2.0, 12.0),
                "Oficina": (2.5, 10.0),
                "Hogar": (3.0, 15.0),
                "Deportes y Recreación": (5.0, 20.0),
                "Salud y Bienestar": (1.5, 8.0),
            }

            min_precio, max_precio = precios_base.get(categoria, (3.0, 15.0))
            precio = round(random.uniform(min_precio, max_precio), 2)

            producto = {
                "id": f"producto-{producto_id_counter:03d}",
                "nombre": nombre,
                "slug": slug,
                "categoria": categoria,
                "categoria_slug": categoria_slug,
                "descripcion_corta": descripcion,
                "imagen_url": imagen_url,
                "precio": precio,
                "fuente": "Marpico Promocionales"
            }

            productos_finales.append(producto)
            producto_id_counter += 1

    # Guardar JSON
    output_dir = os.path.join(os.path.dirname(__file__), '..', 'data')
    os.makedirs(output_dir, exist_ok=True)

    output_path = os.path.join(output_dir, 'products.json')

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(productos_finales, f, ensure_ascii=False, indent=2)

    print(f"✓ Generados {len(productos_finales)} productos")
    print(f"✓ Guardado en: {output_path}")
    print(f"\nProductos por categoría:")

    # Estadísticas
    cats = {}
    for p in productos_finales:
        cat = p['categoria']
        cats[cat] = cats.get(cat, 0) + 1

    for cat, count in sorted(cats.items()):
        print(f"  - {cat}: {count} productos")

    print(f"\n✓ Total de categorías: {len(cats)}")

if __name__ == "__main__":
    generar_productos_json()
