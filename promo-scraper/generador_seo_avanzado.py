"""
Generador Avanzado de Meta Descripciones SEO
Crea descripciones únicas basadas en características del producto
"""

import json
import re
import random
from typing import Dict, List


class GeneradorSEO:
    """Genera contenido SEO optimizado y único para cada producto"""

    def __init__(self):
        # Palabras clave primarias para Ecuador
        self.keywords_ecuador = [
            "Ecuador", "Quito", "Guayaquil", "Cuenca",
            "empresas ecuatorianas", "negocios en Ecuador"
        ]

        # Palabras relacionadas con personalización
        self.personalizacion_terms = [
            "personalizado con tu logo",
            "impresión de alta calidad",
            "personalizable a tu medida",
            "con tu marca",
            "diseño exclusivo",
            "personalización profesional",
            "grabado láser disponible",
            "serigrafía de calidad"
        ]

        # Términos de calidad y confianza
        self.trust_terms = [
            "calidad premium",
            "materiales de primera",
            "durabilidad garantizada",
            "acabado profesional",
            "resistente y funcional",
            "diseño moderno",
            "alta calidad"
        ]

        # Casos de uso comunes
        self.casos_uso = [
            "eventos corporativos",
            "ferias comerciales",
            "campañas publicitarias",
            "regalos empresariales",
            "merchandising de marca",
            "activaciones de marca",
            "convenciones",
            "conferencias",
            "seminarios",
            "lanzamientos de producto"
        ]

        # Beneficios específicos
        self.beneficios = [
            "aumenta el reconocimiento de tu marca",
            "genera recordación en tus clientes",
            "fortalece tu imagen corporativa",
            "destaca en eventos",
            "fideliza a tus clientes",
            "mejora tu presencia de marca"
        ]

    def detectar_categoria_especifica(self, nombre: str, categoria: str) -> str:
        """Detecta la categoría específica del producto por su nombre"""
        nombre_lower = nombre.lower()
        categoria_lower = categoria.lower()

        # Mapeo de palabras clave a categorías específicas
        categorias_map = {
            'textil': ['camiseta', 'polo', 'gorra', 'chaleco', 'chaqueta', 'sudadera', 'bufanda', 'delantal'],
            'tecnologia': ['usb', 'power bank', 'auricular', 'mouse', 'teclado', 'cable', 'hub', 'cargador', 'tablet', 'smartphone'],
            'escritura': ['boligrafo', 'lapicero', 'pluma', 'marcador', 'resaltador', 'portaminas', 'lapiz'],
            'oficina': ['cuaderno', 'agenda', 'carpeta', 'archivador', 'portadocumento', 'escritorio', 'organizador'],
            'hogar': ['taza', 'plato', 'vaso', 'mantel', 'cojin', 'manta', 'reloj', 'foto', 'marco'],
            'bebidas': ['termo', 'botella', 'vaso', 'jarra', 'taza', 'mug', 'cantimplora', 'cooler'],
            'llaveros': ['llavero', 'llave', 'key', 'keychain'],
            'bolsos': ['bolso', 'mochila', 'morral', 'maleta', 'neceser', 'portafolio', 'cartera', 'tote'],
            'paraguas': ['paraguas', 'sombrilla'],
            'deporte': ['deportivo', 'gym', 'fitness', 'yoga', 'running', 'ciclismo', 'pelota', 'balon'],
            'herramientas': ['herramienta', 'destornillador', 'martillo', 'llave', 'kit', 'multiuso', 'navaja'],
            'salud': ['tapabocas', 'mascarilla', 'gel', 'desinfectante', 'kit medico', 'primeros auxilios'],
            'ecologico': ['ecologico', 'reciclado', 'biodegradable', 'bambu', 'carton', 'kraft', 'sostenible']
        }

        for cat_key, keywords in categorias_map.items():
            if any(keyword in nombre_lower for keyword in keywords):
                return cat_key

        # Si no se detecta, usar la categoría original limpia
        return self.limpiar_categoria(categoria_lower)

    def limpiar_categoria(self, categoria: str) -> str:
        """Limpia y normaliza nombres de categorías"""
        categoria = categoria.lower().strip()
        # Remover caracteres especiales
        categoria = re.sub(r'[^a-z0-9\s-]', '', categoria)
        return categoria

    def generar_descripcion_corta(self, nombre: str, categoria: str) -> str:
        """Genera una descripción corta única (shortDescription)"""
        cat_especifica = self.detectar_categoria_especifica(nombre, categoria)

        templates = [
            f"{nombre} {random.choice(self.personalizacion_terms)}. {random.choice(self.trust_terms).capitalize()} ideal para {random.choice(self.casos_uso)}.",

            f"Descubre {nombre}, {random.choice(self.trust_terms)}. {random.choice(self.personalizacion_terms).capitalize()} para {random.choice(self.casos_uso)} en Ecuador.",

            f"{nombre} promocional que {random.choice(self.beneficios)}. {random.choice(self.personalizacion_terms).capitalize()}.",

            f"Compra {nombre} {random.choice(self.personalizacion_terms)}. Perfecto para {random.choice(self.casos_uso)} y {random.choice(self.casos_uso)}.",

            f"{nombre} de {random.choice(self.trust_terms)} con {random.choice(self.personalizacion_terms)}. Ideal para empresas en {random.choice(self.keywords_ecuador[:4])}."
        ]

        return random.choice(templates)

    def generar_historia(self, nombre: str, categoria: str) -> str:
        """Genera una historia única para el producto (story)"""
        cat_especifica = self.detectar_categoria_especifica(nombre, categoria)

        historias = [
            f"{nombre} es la elección perfecta para empresas que buscan {random.choice(self.beneficios)}. Su {random.choice(self.trust_terms)} lo convierte en un regalo memorable que tus clientes apreciarán y usarán constantemente.",

            f"Con {nombre}, tu marca estará presente en el día a día de tus clientes. Este producto combina funcionalidad y estilo, ofreciendo una {random.choice(self.personalizacion_terms)} que garantiza máxima visibilidad para tu empresa.",

            f"Diseñado para {random.choice(self.casos_uso)}, {nombre} destaca por su {random.choice(self.trust_terms)} y versatilidad. La {random.choice(self.personalizacion_terms)} asegura que tu logo luzca impecable en cada uso.",

            f"{nombre} transforma cada interacción en una oportunidad de marca. Su diseño cuidadosamente pensado y {random.choice(self.trust_terms)} lo hacen ideal para empresas que valoran la calidad en sus regalos promocionales.",

            f"Más que un artículo promocional, {nombre} es una inversión en la recordación de tu marca. Fabricado con {random.choice(self.trust_terms)}, ofrece {random.choice(self.personalizacion_terms)} que impacta y perdura."
        ]

        return random.choice(historias)

    def generar_seo_description(self, nombre: str, categoria: str) -> str:
        """Genera meta descripción SEO optimizada (max 150-155 caracteres)"""
        cat_especifica = self.detectar_categoria_especifica(nombre, categoria)

        templates = [
            f"{nombre} personalizado con logo en Ecuador. {random.choice(self.trust_terms).capitalize()}. ¡Cotiza por WhatsApp!",

            f"{nombre} {random.choice(self.personalizacion_terms)}. Ideal para empresas. Envíos en Ecuador. ¡Cotiza ya!",

            f"Compra {nombre} promocional. {random.choice(self.trust_terms).capitalize()}. Envíos en Ecuador. ¡Cotiza ahora!",

            f"{nombre} con tu logo. {random.choice(self.beneficios).capitalize()}. ¡Pide cotización por WhatsApp!",

            f"{nombre} personalizado Ecuador. {random.choice(self.trust_terms).capitalize()}. Envíos rápidos. ¡Cotiza!",
        ]

        desc = random.choice(templates)

        # Asegurar que no exceda 155 caracteres
        if len(desc) > 155:
            desc = desc[:152] + '...'

        return desc

    def generar_seo_title(self, nombre: str) -> str:
        """Genera título SEO optimizado (max 55-60 caracteres)"""
        sufijos = [
            "Personalizado | KS Ecuador",
            "con Logo | KS Ecuador",
            "Ecuador | KS Promocionales",
            "Promocional | KS",
            "Ecuador | KS"
        ]

        titulo = f"{nombre} {random.choice(sufijos)}"

        # Asegurar que no exceda 60 caracteres
        if len(titulo) > 60:
            # Intentar con sufijo más corto
            titulo = f"{nombre} | KS Ecuador"

            # Si aún es muy largo, recortar el nombre
            if len(titulo) > 60:
                nombre_corto = nombre[:50]
                titulo = f"{nombre_corto}... | KS"

        return titulo

    def generar_keywords(self, nombre: str, categoria: str) -> str:
        """Genera keywords SEO (NOTA: Google no usa meta keywords, pero se deja para otros buscadores)"""
        cat_especifica = self.detectar_categoria_especifica(nombre, categoria)

        keywords_base = [
            nombre.lower(),
            f"{nombre.lower()} personalizado",
            f"{nombre.lower()} ecuador",
            cat_especifica,
            "regalo corporativo ecuador",
            "articulo promocional",
        ]

        return ", ".join(keywords_base[:6])

    def generar_features(self, nombre: str, categoria: str) -> List[str]:
        """Genera lista de características"""
        cat_especifica = self.detectar_categoria_especifica(nombre, categoria)

        features_genericas = [
            "Impresión de alta calidad",
            "Personalización con tu logo",
            "Diseño moderno y funcional",
            "Materiales de calidad premium",
            "Múltiples opciones de personalización",
            "Uso prolongado y duradero",
            "Acabado profesional",
            "Disponible en varios colores"
        ]

        # Features específicas por categoría
        features_especificas = {
            'textil': ["100% algodón", "Tallas disponibles: S a XXL", "Lavable en máquina", "Colores variados"],
            'tecnologia': ["Compatible con múltiples dispositivos", "Incluye cable USB", "Batería de larga duración", "Diseño ergonómico"],
            'escritura': ["Tinta de secado rápido", "Grip ergonómico", "Punta fina", "Recargable"],
            'oficina': ["Papel de alta calidad", "Hojas rayadas/cuadriculadas", "Espiral resistente", "Tamaño A4/A5"],
            'bebidas': ["Mantiene temperatura por 12h", "Acero inoxidable", "Libre de BPA", "Tapa hermética"],
            'llaveros': ["Anilla de metal resistente", "Diseño compacto", "Grabado láser disponible", "Variedad de formas"],
            'bolsos': ["Múltiples compartimentos", "Correas ajustables", "Cierre de seguridad", "Resistente al agua"],
            'ecologico': ["Material reciclado", "Biodegradable", "Libre de plásticos", "Certificación ecológica"]
        }

        # Combinar features genéricas con específicas
        features = random.sample(features_genericas, 4)

        if cat_especifica in features_especificas:
            features.extend(random.sample(features_especificas[cat_especifica], min(2, len(features_especificas[cat_especifica]))))

        return features[:6]

    def generar_use_cases(self, categoria: str) -> List[str]:
        """Genera casos de uso específicos"""
        return random.sample(self.casos_uso, min(4, len(self.casos_uso)))

    def procesar_producto(self, producto: Dict) -> Dict:
        """Procesa un producto y genera todo su contenido SEO"""
        nombre = producto.get('nombre', '')
        categoria = producto.get('categoria', '')

        # Generar todos los campos SEO
        producto_procesado = producto.copy()

        producto_procesado.update({
            'shortDescription': self.generar_descripcion_corta(nombre, categoria),
            'story': self.generar_historia(nombre, categoria),
            'seoTitle': self.generar_seo_title(nombre),
            'seoDescription': self.generar_seo_description(nombre, categoria),
            'keywords': self.generar_keywords(nombre, categoria),
            'features': self.generar_features(nombre, categoria),
            'useCases': self.generar_use_cases(categoria)
        })

        return producto_procesado


def procesar_archivo(input_file: str, output_file: str):
    """Procesa un archivo JSON de productos y genera contenido SEO"""
    print(f"\n[INFO] Procesando archivo: {input_file}")

    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            productos = json.load(f)

        print(f"[OK] Cargados {len(productos)} productos")

        generador = GeneradorSEO()
        productos_procesados = []

        print("[INFO] Generando contenido SEO único para cada producto...")

        for idx, producto in enumerate(productos, 1):
            if idx % 100 == 0:
                print(f"  Procesados {idx}/{len(productos)}")

            producto_procesado = generador.procesar_producto(producto)
            productos_procesados.append(producto_procesado)

        # Guardar archivo procesado
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(productos_procesados, f, ensure_ascii=False, indent=2)

        print(f"\n[OK] Archivo guardado: {output_file}")
        print(f"[OK] Total productos procesados: {len(productos_procesados)}")

        # Mostrar muestra
        print("\n--- MUESTRA DE PRODUCTO PROCESADO ---")
        if productos_procesados:
            p = productos_procesados[0]
            print(f"\nNombre: {p['nombre']}")
            print(f"Categoría: {p['categoria']}")
            print(f"\nSEO Title: {p['seoTitle']}")
            print(f"\nSEO Description: {p['seoDescription']}")
            print(f"\nShort Description: {p['shortDescription']}")
            print(f"\nStory: {p['story'][:150]}...")
            print(f"\nFeatures: {', '.join(p['features'][:3])}...")
            print(f"\nUse Cases: {', '.join(p['useCases'])}")
            print(f"\nKeywords: {p['keywords'][:80]}...")

    except Exception as e:
        print(f"[ERROR] {e}")


def main():
    """Función principal"""
    import os

    # Rutas de archivos
    script_dir = os.path.dirname(__file__)
    data_dir = os.path.join(script_dir, '..', 'data')

    input_file = os.path.join(data_dir, 'productos_scraped_completo.json')
    output_file = os.path.join(data_dir, 'productos_con_seo.json')

    # Si no existe el archivo scraped_completo, usar el avanzado
    if not os.path.exists(input_file):
        input_file = os.path.join(data_dir, 'productos_avanzado.json')

    if not os.path.exists(input_file):
        print(f"[ERROR] No se encontró archivo de entrada: {input_file}")
        print("[INFO] Ejecuta primero el scraper_avanzado.py")
        return

    procesar_archivo(input_file, output_file)


if __name__ == "__main__":
    main()
