"""
Mejora los productos actuales con metadescripciones SEO profesionales
Basado en GUIA_SCRAPING_SSG.md
"""

import json
import random
from pathlib import Path

class MejoradorSEO:
    def __init__(self):
        self.templates_seo = {
            'Artículos de Escritura': [
                "{nombre} personalizado con logo. Regalo corporativo perfecto para empresas en Ecuador. Impresión de alta calidad garantizada.",
                "Compra {nombre} promocional en Ecuador. Artículo de escritura personalizable con tu marca. Ideal para eventos corporativos.",
                "{nombre} para tu empresa. Producto promocional de calidad premium. Entrega rápida en Quito, Guayaquil y todo Ecuador.",
                "{nombre} con impresión de logo profesional. Regalo empresarial de impacto para ferias, conferencias y activaciones de marca.",
            ],
            'Drinkware': [
                "{nombre} personalizado para tu marca. Producto promocional de alta durabilidad. Perfecto para campañas publicitarias en Ecuador.",
                "Cotiza {nombre} con logo de tu empresa. Drinkware promocional de calidad premium. Ideal para regalos corporativos.",
                "{nombre} promocional ecuatoriano. Personalización profesional con impresión duradera. Excelente para merchandising empresarial.",
                "Compra {nombre} personalizable en Ecuador. Regalo corporativo práctico y memorable para tus clientes y colaboradores.",
            ],
            'Textil y Vestuario': [
                "{nombre} personalizado con bordado o estampado. Vestuario promocional de alta calidad para empresas en Ecuador.",
                "Cotiza {nombre} con logo de tu marca. Textil promocional profesional. Ideal para uniformes corporativos y eventos.",
                "{nombre} promocional ecuatoriano. Personalización de calidad premium. Perfecto para campañas publicitarias y merchandising.",
                "{nombre} para tu empresa en Ecuador. Vestuario corporativo con impresión duradera. Entrega en todo el país.",
            ],
            'Tecnología': [
                "{nombre} personalizado con logo. Gadget promocional de última generación. Regalo corporativo tecnológico en Ecuador.",
                "Compra {nombre} promocional de alta calidad. Tech gift perfecto para empresas. Personalización profesional garantizada.",
                "{nombre} con impresión de tu marca. Producto tecnológico promocional. Ideal para eventos, ferias y regalos ejecutivos.",
                "Cotiza {nombre} personalizable en Ecuador. Regalo corporativo tech. Perfecto para campañas de marketing y fidelización.",
            ],
            'Bolsos y Mochilas': [
                "{nombre} personalizado con logo bordado. Bolso promocional de alta resistencia. Ideal para eventos corporativos en Ecuador.",
                "Compra {nombre} con impresión de tu marca. Mochila promocional de calidad premium. Perfecto para regalos empresariales.",
                "{nombre} promocional ecuatoriano. Personalización duradera y profesional. Excelente para merchandising y campañas publicitarias.",
                "{nombre} para tu empresa. Producto promocional funcional y elegante. Entrega rápida en todo Ecuador.",
            ],
            'Accesorios': [
                "{nombre} personalizado con logo. Accesorio promocional práctico y memorable. Regalo corporativo en Ecuador.",
                "Cotiza {nombre} con impresión de tu marca. Accesorio útil para campañas publicitarias. Personalización de calidad.",
                "{nombre} promocional de alta calidad. Ideal para eventos, ferias y activaciones de marca en Ecuador.",
                "Compra {nombre} personalizable. Regalo corporativo funcional. Perfecto para merchandising empresarial ecuatoriano.",
            ],
            'Oficina': [
                "{nombre} personalizado con logo. Artículo de oficina promocional de calidad. Ideal para empresas en Ecuador.",
                "Cotiza {nombre} con impresión corporativa. Producto de oficina útil y elegante. Perfecto para regalos empresariales.",
                "{nombre} promocional ecuatoriano. Artículo de escritorio profesional. Excelente para merchandising corporativo.",
                "Compra {nombre} para tu empresa. Producto de oficina personalizable. Entrega en Quito, Guayaquil y todo Ecuador.",
            ],
            'Hogar': [
                "{nombre} personalizado con logo. Artículo para el hogar promocional. Regalo corporativo útil y memorable en Ecuador.",
                "Cotiza {nombre} con impresión de tu marca. Producto para el hogar de calidad. Ideal para campañas publicitarias.",
                "{nombre} promocional ecuatoriano. Artículo práctico y elegante. Perfecto para regalos empresariales y merchandising.",
                "Compra {nombre} personalizable. Regalo corporativo para el hogar. Personalización profesional garantizada.",
            ],
            'Deportes y Recreación': [
                "{nombre} personalizado con logo. Artículo deportivo promocional de calidad. Ideal para eventos en Ecuador.",
                "Cotiza {nombre} con impresión de tu marca. Producto deportivo perfecto para campañas de wellness corporativo.",
                "{nombre} promocional ecuatoriano. Artículo de recreación profesional. Excelente para activaciones de marca y eventos.",
                "Compra {nombre} para tu empresa. Producto deportivo personalizable. Ideal para programas de bienestar corporativo.",
            ],
            'Salud y Bienestar': [
                "{nombre} personalizado con logo. Producto de salud promocional responsable. Ideal para empresas en Ecuador.",
                "Cotiza {nombre} con impresión corporativa. Artículo de bienestar de calidad. Perfecto para campañas de salud.",
                "{nombre} promocional ecuatoriano. Producto de cuidado personal profesional. Excelente para merchandising empresarial.",
                "Compra {nombre} personalizable. Regalo corporativo de bienestar. Ideal para programas de salud ocupacional.",
            ],
        }

    def generar_seo_description(self, nombre: str, categoria: str) -> str:
        """Genera metadescripción SEO única"""
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
            f"{nombre_lower} quito",
            f"{nombre_lower} guayaquil",
            categoria_lower,
            "regalo corporativo",
            "merchandising ecuador",
            "producto promocional",
            "personalizado logo",
        ]

        return ', '.join(keywords[:12])

    def mejorar_productos(self, input_file='../data/products.json', output_file='../data/products.json'):
        """Mejora los productos existentes con SEO profesional"""
        print("Cargando productos...")

        with open(input_file, 'r', encoding='utf-8') as f:
            productos = json.load(f)

        print(f"Total productos: {len(productos)}")
        print("\nMejorando SEO...")

        productos_mejorados = []

        for idx, producto in enumerate(productos, 1):
            nombre = producto['nombre']
            categoria = producto['categoria']

            # Generar SEO mejorado
            seo_description = self.generar_seo_description(nombre, categoria)
            seo_keywords = self.generar_seo_keywords(nombre, categoria)
            seo_title = f"{nombre} Personalizado Ecuador | PromoGimmicks"

            # Actualizar producto
            producto_mejorado = {
                'id': producto['id'],
                'nombre': nombre,
                'slug': producto['slug'],
                'categoria': categoria,
                'categoria_slug': producto['categoria_slug'],
                'descripcion_corta': seo_description,
                'imagen_url': '/img/placeholder-producto.svg',  # Placeholder hasta tener imágenes reales
                'seo_title': seo_title,
                'seo_description': seo_description,
                'seo_keywords': seo_keywords,
            }

            productos_mejorados.append(producto_mejorado)

            if idx % 10 == 0:
                print(f"  Procesados {idx}/{len(productos)}...")

        # Guardar
        print(f"\nGuardando en {output_file}...")
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(productos_mejorados, f, ensure_ascii=False, indent=2)

        print(f"[OK] {len(productos_mejorados)} productos mejorados con SEO profesional")

        # Muestra
        print("\n--- MUESTRA DE PRODUCTOS MEJORADOS ---")
        for p in productos_mejorados[:3]:
            print(f"\n* {p['nombre']}")
            print(f"  SEO Title: {p['seo_title']}")
            print(f"  SEO Description: {p['seo_description'][:80]}...")
            print(f"  Keywords: {p['seo_keywords'][:80]}...")


def main():
    mejorador = MejoradorSEO()
    mejorador.mejorar_productos()

    print("\n" + "="*70)
    print("MEJORA SEO COMPLETADA")
    print("="*70)
    print("\nLos productos ahora tienen:")
    print("  ✓ Metadescripciones SEO únicas y profesionales")
    print("  ✓ Keywords optimizadas para Ecuador")
    print("  ✓ Títulos SEO personalizados")
    print("  ✓ Contenido listo para Google")
    print("\nReinicia el servidor para ver los cambios!")


if __name__ == "__main__":
    main()
