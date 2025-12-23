'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp } from 'lucide-react';
import ProductShowcase from './ProductShowcase';
import CTABanner from './CTABanner';
import productsData from '@/data/products.json';

// Seleccionar productos por categoría
const getProductsByCategory = (category: string, limit: number = 4) => {
  return productsData
    .filter(p => p.categoria.toLowerCase().includes(category.toLowerCase()))
    .slice(0, limit);
};

// Productos mixtos destacados
const getFeaturedProducts = (limit: number = 4) => {
  const categories = ['Tecnología', 'Drinkware', 'Oficina', 'Accesorios'];
  const featured: typeof productsData = [];

  categories.forEach(cat => {
    const product = productsData.find(p => p.categoria === cat);
    if (product) featured.push(product);
  });

  return featured.slice(0, limit);
};

export default function BlogQuitoContent() {
  const [tocOpen, setTocOpen] = useState(true);

  // Productos para las diferentes secciones
  const ecoProducts = getProductsByCategory('Eco', 4);
  const officeProducts = getProductsByCategory('Oficina', 4);
  const drinkwareProducts = getProductsByCategory('Drinkware', 3);
  const accessoryProducts = getProductsByCategory('Accesorios', 4);
  const featuredProducts = getFeaturedProducts(4);

  return (
    <>
      {/* Table of Contents - Collapsible */}
      <div className="mb-10 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <button
          onClick={() => setTocOpen(!tocOpen)}
          className="w-full flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-white hover:from-blue-100 transition-colors"
        >
          <h2 className="text-xl font-bold text-blue-900">Tabla de Contenidos</h2>
          {tocOpen ? <ChevronUp size={24} className="text-blue-600" /> : <ChevronDown size={24} className="text-blue-600" />}
        </button>

        {tocOpen && (
          <nav className="p-6 pt-0">
            <ol className="space-y-2 text-gray-700">
              <li><a href="#introduccion" className="hover:text-amber-600 transition-colors flex items-center gap-2"><span className="w-6 h-6 bg-blue-100 text-blue-900 rounded-full text-xs flex items-center justify-center font-bold">1</span> Introducción</a></li>
              <li><a href="#por-que-elegir" className="hover:text-amber-600 transition-colors flex items-center gap-2"><span className="w-6 h-6 bg-blue-100 text-blue-900 rounded-full text-xs flex items-center justify-center font-bold">2</span> ¿Por Qué Elegir Productos Promocionales Baratos?</a></li>
              <li><a href="#ideas-creativas" className="hover:text-amber-600 transition-colors flex items-center gap-2"><span className="w-6 h-6 bg-blue-100 text-blue-900 rounded-full text-xs flex items-center justify-center font-bold">3</span> Ideas Creativas de Productos Baratos</a></li>
              <li><a href="#proveedores-quito" className="hover:text-amber-600 transition-colors flex items-center gap-2"><span className="w-6 h-6 bg-blue-100 text-blue-900 rounded-full text-xs flex items-center justify-center font-bold">4</span> Dónde Encontrar Proveedores en Quito</a></li>
              <li><a href="#personalizar" className="hover:text-amber-600 transition-colors flex items-center gap-2"><span className="w-6 h-6 bg-blue-100 text-blue-900 rounded-full text-xs flex items-center justify-center font-bold">5</span> Cómo Personalizar Productos</a></li>
              <li><a href="#presupuesto" className="hover:text-amber-600 transition-colors flex items-center gap-2"><span className="w-6 h-6 bg-blue-100 text-blue-900 rounded-full text-xs flex items-center justify-center font-bold">6</span> Presupuesto Ajustado</a></li>
              <li><a href="#eventos" className="hover:text-amber-600 transition-colors flex items-center gap-2"><span className="w-6 h-6 bg-blue-100 text-blue-900 rounded-full text-xs flex items-center justify-center font-bold">7</span> Productos para Eventos en Quito</a></li>
              <li><a href="#calidad" className="hover:text-amber-600 transition-colors flex items-center gap-2"><span className="w-6 h-6 bg-blue-100 text-blue-900 rounded-full text-xs flex items-center justify-center font-bold">8</span> Calidad y Durabilidad</a></li>
              <li><a href="#impacto-ambiental" className="hover:text-amber-600 transition-colors flex items-center gap-2"><span className="w-6 h-6 bg-blue-100 text-blue-900 rounded-full text-xs flex items-center justify-center font-bold">9</span> Impacto Ambiental y Sostenibilidad</a></li>
              <li><a href="#faq" className="hover:text-amber-600 transition-colors flex items-center gap-2"><span className="w-6 h-6 bg-blue-100 text-blue-900 rounded-full text-xs flex items-center justify-center font-bold">10</span> Preguntas Frecuentes</a></li>
              <li><a href="#roi" className="hover:text-amber-600 transition-colors flex items-center gap-2"><span className="w-6 h-6 bg-blue-100 text-blue-900 rounded-full text-xs flex items-center justify-center font-bold">11</span> Medir el ROI</a></li>
              <li><a href="#errores" className="hover:text-amber-600 transition-colors flex items-center gap-2"><span className="w-6 h-6 bg-blue-100 text-blue-900 rounded-full text-xs flex items-center justify-center font-bold">12</span> Errores Comunes a Evitar</a></li>
              <li><a href="#tendencias" className="hover:text-amber-600 transition-colors flex items-center gap-2"><span className="w-6 h-6 bg-blue-100 text-blue-900 rounded-full text-xs flex items-center justify-center font-bold">13</span> Tendencias Actuales</a></li>
              <li><a href="#conclusion" className="hover:text-amber-600 transition-colors flex items-center gap-2"><span className="w-6 h-6 bg-blue-100 text-blue-900 rounded-full text-xs flex items-center justify-center font-bold">14</span> Conclusión</a></li>
            </ol>
          </nav>
        )}
      </div>

      {/* Article Content */}
      <div className="prose prose-lg max-w-none prose-headings:text-blue-900 prose-a:text-amber-600 prose-a:no-underline hover:prose-a:underline">

        {/* Introducción */}
        <section id="introduccion" className="scroll-mt-24">
          <p className="text-lg text-gray-700 leading-relaxed">
            ¿Buscas que tu marca resuene en cada rincón de Quito sin vaciar tu presupuesto? La clave está en los productos promocionales baratos, pero encontrar opciones efectivas y proveedores confiables puede ser un desafío. En este artículo, te revelaremos ideas creativas y te guiaremos a través de los mejores proveedores de Quito para que puedas personalizar productos promocionales impactantes, maximizando el alcance de tu marca con una inversión mínima. ¡Prepárate para conquistar el mercado quiteño con promociones inteligentes y asequibles!
          </p>

          {/* Imagen de introducción */}
          <figure className="my-8">
            <img
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=450&fit=crop&q=80"
              alt="Productos promocionales y merchandising empresarial"
              className="w-full rounded-2xl shadow-lg"
            />
            <figcaption className="text-center text-gray-500 text-sm mt-3">
              Los productos promocionales son una inversión inteligente para tu marca
            </figcaption>
          </figure>
        </section>

        {/* PRODUCTOS DESTACADOS - PRIMERA INSERCIÓN */}
        <ProductShowcase
          products={featuredProducts}
          title="Productos Más Populares en Ecuador"
          subtitle="Los favoritos de nuestros clientes para campañas exitosas"
          variant="featured"
        />

        {/* Sección 1: Por Qué Elegir */}
        <section id="por-que-elegir" className="scroll-mt-24">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mt-12 mb-6">
            ¿Por Qué Elegir Productos Promocionales Baratos en Quito para tu Estrategia de Marketing?
          </h2>

          <p>
            Los <strong>productos promocionales</strong> son una herramienta poderosa para aumentar la visibilidad de tu marca en Quito. Elegir opciones asequibles no significa sacrificar calidad o impacto, sino ser estratégico con tu presupuesto de marketing. Con la planificación correcta, puedes lograr resultados sorprendentes con una inversión modesta.
          </p>

          <h3 className="text-xl font-bold text-blue-800 mt-8 mb-4">Maximiza tu Alcance con un Presupuesto Limitado</h3>

          <p>
            El principal beneficio de optar por <strong>productos promocionales baratos</strong> es, obviamente, el ahorro. Esto te permite distribuir una mayor cantidad de artículos, ampliando significativamente tu alcance. En lugar de invertir fuertemente en un solo producto costoso, puedes llegar a más clientes potenciales con una variedad de opciones asequibles. Por ejemplo, considera regalar bolígrafos personalizados, llaveros o stickers con el logo de tu empresa en eventos locales o ferias.
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-6 rounded-r-lg">
            <h4 className="font-bold text-blue-900 mb-3">Ideas de Productos Promocionales Asequibles:</h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                <span><strong>Bolsas de tela reutilizables:</strong> Prácticas y ecológicas, ideales para mercados y ferias.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                <span><strong>Llaveros con abrebotellas:</strong> Útiles y atractivos para negocios de alimentos y bebidas.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                <span><strong>Calcomanías (stickers) personalizadas:</strong> Perfectas para campañas virales.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                <span><strong>Gorras o viseras:</strong> Un clásico que siempre funciona en eventos al aire libre.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                <span><strong>Artículos de oficina básicos:</strong> Post-it, clips o calendarios de bolsillo.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* CTA Inline */}
        <CTABanner
          variant="inline"
          title="¿Ya sabes qué productos necesitas?"
          subtitle="Explora nuestro catálogo con más de 199 opciones"
        />

        {/* Sección 2: Ideas Creativas */}
        <section id="ideas-creativas" className="scroll-mt-24">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mt-12 mb-6">
            Ideas Creativas de Productos Promocionales Baratos y Efectivos en Quito
          </h2>

          {/* Imagen de ideas creativas */}
          <figure className="my-8">
            <img
              src="https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&h=450&fit=crop&q=80"
              alt="Ideas creativas para productos promocionales"
              className="w-full rounded-2xl shadow-lg"
            />
            <figcaption className="text-center text-gray-500 text-sm mt-3">
              La creatividad es clave para destacar con productos promocionales económicos
            </figcaption>
          </figure>

          <p>
            La clave para un <strong>producto promocional económico</strong> exitoso radica en la innovación y la utilidad. No se trata solo de ser barato, sino de ser memorable y práctico para el usuario.
          </p>

          <h3 className="text-xl font-bold text-blue-800 mt-8 mb-4">Productos Promocionales con un Toque Ecuatoriano</h3>

          <p>Incorpore la cultura ecuatoriana en sus productos promocionales. Pequeños detalles pueden hacer una gran diferencia:</p>

          <ul className="list-disc pl-6 space-y-2 my-4">
            <li><strong>Miniaturas de sombreros de paja toquilla:</strong> Un recuerdo auténtico y atractivo que representa la artesanía local.</li>
            <li><strong>Semillas de plantas nativas:</strong> Un regalo ecológico y sostenible con instrucciones de siembra.</li>
            <li><strong>Dulces tradicionales en empaques personalizados:</strong> Manjar de leche, cocadas o suspiros en pequeñas cajas con su logo.</li>
          </ul>

          <h3 className="text-xl font-bold text-blue-800 mt-8 mb-4">Productos Promocionales Digitales y Tecnológicos</h3>

          <p>En la era digital, los artículos promocionales no tienen que ser físicos para ser efectivos:</p>

          <ul className="list-disc pl-6 space-y-2 my-4">
            <li><strong>Códigos QR con descuentos:</strong> Imprima códigos QR que dirijan a ofertas especiales.</li>
            <li><strong>Protectores de webcam personalizados:</strong> Un regalo práctico y económico.</li>
            <li><strong>Fondos de pantalla para dispositivos móviles:</strong> Diseños atractivos con el logo de su empresa.</li>
          </ul>
        </section>

        {/* PRODUCTOS DE OFICINA */}
        <ProductShowcase
          products={officeProducts}
          title="Artículos de Oficina Personalizables"
          subtitle="Perfectos para regalos ejecutivos y corporativos"
          variant="compact"
        />

        {/* Sección 3: Proveedores en Quito */}
        <section id="proveedores-quito" className="scroll-mt-24">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mt-12 mb-6">
            Dónde Encontrar Proveedores de Productos Promocionales Baratos en Quito
          </h2>

          {/* Imagen de proveedores/mercado */}
          <figure className="my-8">
            <img
              src="https://images.unsplash.com/photo-1556742393-d75f468bfcb0?w=800&h=450&fit=crop&q=80"
              alt="Proveedores de productos promocionales en Quito"
              className="w-full rounded-2xl shadow-lg"
            />
            <figcaption className="text-center text-gray-500 text-sm mt-3">
              Encuentra los mejores proveedores de productos promocionales en Quito
            </figcaption>
          </figure>

          <p>
            Encontrar <strong>proveedores de productos promocionales baratos en Quito</strong> puede ser un desafío, pero existen opciones viables si sabes dónde buscar.
          </p>

          <h3 className="text-xl font-bold text-blue-800 mt-8 mb-4">Empresas Especializadas en Productos Promocionales</h3>

          <div className="bg-amber-50 border-l-4 border-amber-500 p-6 my-6 rounded-r-lg">
            <h4 className="font-bold text-amber-900 mb-3">Consejos para encontrar proveedores:</h4>
            <ul className="space-y-2 text-amber-800">
              <li>✓ Investigue en línea usando Google Maps o directorios empresariales</li>
              <li>✓ Solicite cotizaciones a varias empresas para comparar</li>
              <li>✓ Pregunte por descuentos por volumen</li>
              <li>✓ Negocie precios, especialmente si es cliente recurrente</li>
            </ul>
          </div>

          <h3 className="text-xl font-bold text-blue-800 mt-8 mb-4">Mercados Populares y Centros de Distribución</h3>

          <ul className="list-disc pl-6 space-y-2 my-4">
            <li><strong>Mercado de San Roque:</strong> Conocido por su variedad de productos y precios competitivos.</li>
            <li><strong>Centros comerciales del centro histórico:</strong> Pequeñas tiendas con servicios de impresión y personalización.</li>
            <li><strong>Proveedores en línea con presencia local:</strong> La comodidad de comprar en línea con contacto local.</li>
          </ul>
        </section>

        {/* CTA WhatsApp */}
        <CTABanner
          variant="whatsapp"
          title="¿Necesitas asesoría para tu pedido?"
          subtitle="Te ayudamos a elegir los mejores productos para tu marca"
        />

        {/* Sección 4: Personalizar */}
        <section id="personalizar" className="scroll-mt-24">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mt-12 mb-6">
            Cómo Personalizar Productos Promocionales para Maximizar el Impacto
          </h2>

          {/* Imagen de personalización */}
          <figure className="my-8">
            <img
              src="https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?w=800&h=450&fit=crop&q=80"
              alt="Personalización de productos promocionales"
              className="w-full rounded-2xl shadow-lg"
            />
            <figcaption className="text-center text-gray-500 text-sm mt-3">
              La personalización efectiva maximiza el impacto de tu marca
            </figcaption>
          </figure>

          <p>
            Un producto promocional bien diseñado puede ser una herramienta poderosa para impulsar el reconocimiento de tu marca en Quito, incluso con un presupuesto limitado.
          </p>

          <h3 className="text-xl font-bold text-blue-800 mt-8 mb-4">Diseño Impactante con Presupuesto Limitado</h3>

          <div className="grid md:grid-cols-2 gap-6 my-8">
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <h4 className="font-bold text-blue-900 mb-4 text-lg">Principios de Diseño</h4>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Menos es más: Diseño minimalista
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Logotipo claro y legible
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Colores que contrasten bien
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Adaptabilidad a diferentes productos
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <h4 className="font-bold text-blue-900 mb-4 text-lg">Técnicas de Personalización</h4>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Serigrafía: Para grandes volúmenes
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Vinilo textil: Para diseños sencillos
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Grabado láser: Acabado elegante
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Tampografía: Para objetos pequeños
                </li>
              </ul>
            </div>
          </div>

          <h3 className="text-xl font-bold text-blue-800 mt-8 mb-4">Consideraciones Adicionales para Quito</h3>

          <p>
            Aprovecha elementos locales en tu diseño para conectar con el público quiteño. Incorpora <strong>motivos andinos</strong>, colores vibrantes o referencias a lugares emblemáticos de la ciudad. Además, ten en cuenta el clima de Quito al elegir los productos promocionales.
          </p>
        </section>

        {/* PRODUCTOS DRINKWARE */}
        <ProductShowcase
          products={drinkwareProducts}
          title="Botellas y Termos Personalizables"
          subtitle="Productos eco-friendly que tus clientes usarán a diario"
          variant="compact"
        />

        {/* Sección 5: Presupuesto */}
        <section id="presupuesto" className="scroll-mt-24">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mt-12 mb-6">
            Presupuesto Ajustado: Estrategias para Optimizar la Inversión
          </h2>

          <p>
            Encontrar <strong>productos promocionales económicos</strong> en Quito no significa sacrificar la calidad ni el impacto de tu campaña. Con una planificación estratégica y un enfoque inteligente, puedes maximizar tu inversión.
          </p>

          <h3 className="text-xl font-bold text-blue-800 mt-8 mb-4">Negociación Estratégica con Proveedores Locales</h3>

          <p>
            La clave para obtener los mejores precios radica en establecer relaciones sólidas con proveedores locales en Quito. Investiga diferentes opciones, solicita cotizaciones detalladas y no dudes en negociar.
          </p>

          <h3 className="text-xl font-bold text-blue-800 mt-8 mb-4">Priorizar Productos de Alto Impacto</h3>

          <div className="bg-green-50 border-l-4 border-green-500 p-6 my-6 rounded-r-lg">
            <h4 className="font-bold text-green-900 mb-3">Productos de alto impacto y bajo costo:</h4>
            <ul className="space-y-2 text-green-800">
              <li>✓ Bolsas reutilizables: Prácticas, ecológicas, gran superficie para tu marca</li>
              <li>✓ Botellas de agua personalizadas: Promueven hidratación y sostenibilidad</li>
              <li>✓ Artículos de escritorio útiles: Bolígrafos, libretas, calendarios de uso diario</li>
            </ul>
          </div>
        </section>

        {/* Sección 6: Eventos */}
        <section id="eventos" className="scroll-mt-24">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mt-12 mb-6">
            Productos Promocionales para Eventos Específicos en Quito
          </h2>

          {/* Imagen de eventos */}
          <figure className="my-8">
            <img
              src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=450&fit=crop&q=80"
              alt="Eventos y ferias en Quito para productos promocionales"
              className="w-full rounded-2xl shadow-lg"
            />
            <figcaption className="text-center text-gray-500 text-sm mt-3">
              Ferias y eventos son oportunidades perfectas para distribuir productos promocionales
            </figcaption>
          </figure>

          <p>
            Los eventos en Quito, como ferias y congresos, son oportunidades valiosas para promocionar tu marca. Existen <strong>productos promocionales económicos</strong> que te permiten generar un impacto significativo sin gastar una fortuna.
          </p>

          <h3 className="text-xl font-bold text-blue-800 mt-8 mb-4">Ideas para Ferias y Exposiciones</h3>

          <ul className="list-disc pl-6 space-y-2 my-4">
            <li><strong>Llaveros personalizados:</strong> Económicos, prácticos y siempre útiles.</li>
            <li><strong>Bolsas de tela no tejida (non-woven):</strong> Duraderas y reutilizables.</li>
            <li><strong>Stickers y calcomanías:</strong> Perfectos para pegar en laptops o cuadernos.</li>
            <li><strong>Imanes promocionales:</strong> Un regalo sencillo que permanece a la vista.</li>
          </ul>

          <h3 className="text-xl font-bold text-blue-800 mt-8 mb-4">Regalos para Congresos y Seminarios</h3>

          <ul className="list-disc pl-6 space-y-2 my-4">
            <li><strong>Libretas y bolígrafos personalizados:</strong> Un clásico que nunca falla.</li>
            <li><strong>Memorias USB personalizadas:</strong> Útiles para almacenar presentaciones.</li>
            <li><strong>Bolsas ecológicas personalizadas:</strong> Opción sostenible y práctica.</li>
            <li><strong>Cargadores USB portátiles:</strong> Un regalo muy apreciado en eventos largos.</li>
          </ul>
        </section>

        {/* PRODUCTOS ACCESORIOS */}
        <ProductShowcase
          products={accessoryProducts}
          title="Accesorios Promocionales Versátiles"
          subtitle="Opciones prácticas que tu audiencia usará constantemente"
          variant="default"
        />

        {/* Sección 7: Calidad */}
        <section id="calidad" className="scroll-mt-24">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mt-12 mb-6">
            Más Allá del Precio: Calidad y Durabilidad
          </h2>

          <p>
            Aunque el precio sea un factor determinante, sacrificar la calidad y la durabilidad puede resultar contraproducente a largo plazo. Un artículo promocional de mala calidad no solo reflejará negativamente en tu marca, sino que también terminará rápidamente en la basura.
          </p>

          <h3 className="text-xl font-bold text-blue-800 mt-8 mb-4">La Percepción de Calidad y su Impacto</h3>

          <p>
            La calidad percibida de tus artículos promocionales influye directamente en la imagen de tu marca. Un producto que se rompe fácilmente envía un mensaje de baja calidad. Por el contrario, un artículo bien hecho, aunque económico, demuestra un compromiso con la calidad y la satisfacción del cliente.
          </p>

          <h3 className="text-xl font-bold text-blue-800 mt-8 mb-4">Pruebas y Muestras: La Clave para Evitar Sorpresas</h3>

          <p>
            Antes de realizar un pedido grande, solicita muestras de los productos promocionales. Realiza pruebas de uso para evaluar su resistencia y durabilidad. Esta inversión en tiempo y pequeñas cantidades te evitará grandes pérdidas y decepciones a futuro.
          </p>
        </section>

        {/* CTA Secondary */}
        <CTABanner
          variant="secondary"
          title="Productos para Cada Presupuesto"
          subtitle="Desde opciones económicas hasta artículos premium. Encuentra el equilibrio perfecto entre calidad y precio."
        />

        {/* Sección 8: Impacto Ambiental */}
        <section id="impacto-ambiental" className="scroll-mt-24">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mt-12 mb-6">
            El Impacto Ambiental y Alternativas Sostenibles en Quito
          </h2>

          {/* Imagen de sostenibilidad */}
          <figure className="my-8">
            <img
              src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=450&fit=crop&q=80"
              alt="Productos promocionales ecológicos y sostenibles"
              className="w-full rounded-2xl shadow-lg"
            />
            <figcaption className="text-center text-gray-500 text-sm mt-3">
              Los productos ecológicos reflejan el compromiso de tu marca con el medio ambiente
            </figcaption>
          </figure>

          <p>
            Los <strong>productos promocionales baratos en Quito</strong> a menudo conllevan un impacto ambiental significativo. Sin embargo, es posible mitigar este impacto optando por alternativas más sostenibles y responsables.
          </p>

          <h3 className="text-xl font-bold text-blue-800 mt-8 mb-4">Alternativas Sostenibles y Biodegradables</h3>

          <p>
            Existen numerosas alternativas ecológicas a los productos promocionales convencionales:
          </p>

          <ul className="list-disc pl-6 space-y-2 my-4">
            <li>Bolígrafos de bambú o materiales reciclados</li>
            <li>Bolsas de tela de algodón orgánico</li>
            <li>Productos biodegradables de fécula de maíz</li>
            <li>Semillas para plantar en empaques personalizados</li>
            <li>Libretas de papel reciclado</li>
            <li>Botellas de agua reutilizables de acero inoxidable</li>
          </ul>
        </section>

        {/* PRODUCTOS ECO */}
        <ProductShowcase
          products={ecoProducts}
          title="Productos Ecológicos y Sostenibles"
          subtitle="Opciones responsables con el medio ambiente"
          variant="default"
        />

        {/* Sección 9: FAQ */}
        <section id="faq" className="scroll-mt-24">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mt-12 mb-6">
            Preguntas Frecuentes sobre Productos Promocionales Baratos en Quito
          </h2>

          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <h4 className="font-bold text-blue-900 mb-3">¿Cómo encontrar proveedores confiables en Quito?</h4>
              <p className="text-gray-700">
                La clave está en investigar y comparar. Pide cotizaciones a varios proveedores y compara no solo los precios, sino también la calidad de los productos, los plazos de entrega y la reputación. Pregunta si ofrecen muestras antes de realizar un pedido grande.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <h4 className="font-bold text-blue-900 mb-3">¿Qué tipo de productos son más efectivos para mi negocio?</h4>
              <p className="text-gray-700">
                La efectividad depende de tu público objetivo. Si tu público son estudiantes, bolígrafos, cuadernos o memorias USB son buenas opciones. Si te diriges a profesionales, tazas, agendas o llaveros podrían ser más adecuados. Los productos útiles y de uso diario suelen tener mayor impacto.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <h4 className="font-bold text-blue-900 mb-3">¿Cómo puedo maximizar el impacto de mis productos promocionales?</h4>
              <p className="text-gray-700">
                Intégralos en una estrategia de marketing más amplia. Utiliza tus productos como parte de una campaña publicitaria, evento o sorteo. Incluye un mensaje claro y conciso. Considera incluir un código QR que dirija a tu sitio web o redes sociales.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <h4 className="font-bold text-blue-900 mb-3">¿Cómo puedo asegurar la calidad de los productos baratos?</h4>
              <p className="text-gray-700">
                Busca proveedores que ofrezcan muestras antes de realizar un pedido grande. Examina la calidad de la impresión, los materiales y la durabilidad. Pregunta sobre las garantías que ofrecen e investiga las reseñas de otros clientes.
              </p>
            </div>
          </div>
        </section>

        {/* Sección 10: ROI */}
        <section id="roi" className="scroll-mt-24">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mt-12 mb-6">
            Medir el Retorno de la Inversión (ROI)
          </h2>

          <p>
            Medir el éxito de tus <strong>productos promocionales baratos en Quito</strong> es crucial para asegurar que tu inversión está generando resultados positivos.
          </p>

          <h3 className="text-xl font-bold text-blue-800 mt-8 mb-4">Establece Objetivos Claros y Medibles</h3>

          <p>
            Antes de lanzar cualquier campaña, define qué quieres lograr. Establecer objetivos <strong>SMART</strong> (específicos, medibles, alcanzables, relevantes y con plazos definidos) te permitirá evaluar el éxito de manera objetiva.
          </p>

          <h3 className="text-xl font-bold text-blue-800 mt-8 mb-4">Métodos Sencillos para el Seguimiento</h3>

          <ul className="list-disc pl-6 space-y-2 my-4">
            <li><strong>Códigos QR:</strong> Rastrea el número de escaneos y conversiones generadas.</li>
            <li><strong>Códigos de Descuento:</strong> Ofrece códigos exclusivos para rastrear ventas directas.</li>
            <li><strong>Encuestas:</strong> Incluye una breve encuesta con el producto promocional.</li>
            <li><strong>Análisis de Tráfico Web:</strong> Monitorea el tráfico antes, durante y después de la campaña.</li>
          </ul>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-6 rounded-r-lg">
            <h4 className="font-bold text-blue-900 mb-3">Fórmula del ROI:</h4>
            <p className="text-gray-700 font-mono">ROI = (Ganancia Neta / Costo de la Inversión) x 100</p>
            <p className="text-gray-600 mt-2 text-sm">
              Ejemplo: Si invertiste $500 en bolígrafos y generaste $1500 en ventas adicionales, tu ROI sería: ($1500 - $500) / $500 x 100 = <strong>200%</strong>
            </p>
          </div>
        </section>

        {/* Sección 11: Errores */}
        <section id="errores" className="scroll-mt-24">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mt-12 mb-6">
            Errores Comunes al Elegir Productos Promocionales y Cómo Evitarlos
          </h2>

          <h3 className="text-xl font-bold text-blue-800 mt-8 mb-4">Priorizar Precio Sobre Calidad</h3>

          <p>
            Es tentador optar por los artículos más baratos, pero esto puede ser contraproducente. Un producto de baja calidad no solo se deteriorará rápidamente, sino que también reflejará negativamente en tu marca. En lugar de buscar lo más económico, considera productos que sean útiles y relevantes para tu público objetivo.
          </p>

          <h3 className="text-xl font-bold text-blue-800 mt-8 mb-4">Descuidar el Diseño y la Personalización</h3>

          <p>
            Un diseño mal ejecutado o una personalización deficiente pueden arruinar incluso el mejor producto promocional. Evita usar imágenes de baja resolución o fuentes difíciles de leer. Trabaja con un diseñador gráfico profesional para crear un diseño atractivo.
          </p>

          <h3 className="text-xl font-bold text-blue-800 mt-8 mb-4">No Considerar el Público Objetivo</h3>

          <p>
            Uno de los errores más grandes es elegir merchandising sin tener en cuenta a quién va dirigido. Investiga a tu público objetivo y elige productos que sean relevantes para sus intereses y necesidades.
          </p>
        </section>

        {/* Sección 12: Tendencias */}
        <section id="tendencias" className="scroll-mt-24">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mt-12 mb-6">
            Tendencias Actuales en Productos Promocionales en Ecuador
          </h2>

          {/* Imagen de tendencias */}
          <figure className="my-8">
            <img
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop&q=80"
              alt="Tendencias en marketing y productos promocionales"
              className="w-full rounded-2xl shadow-lg"
            />
            <figcaption className="text-center text-gray-500 text-sm mt-3">
              Mantente al día con las últimas tendencias en productos promocionales
            </figcaption>
          </figure>

          <h3 className="text-xl font-bold text-blue-800 mt-8 mb-4">Enfoque en la Sostenibilidad</h3>

          <p>
            La conciencia ambiental está en aumento en Quito, y los consumidores valoran cada vez más los productos sostenibles. Optar por artículos promocionales ecológicos no solo es una decisión responsable, sino también una forma de mejorar la imagen de tu marca.
          </p>

          <h3 className="text-xl font-bold text-blue-800 mt-8 mb-4">Digitalización y Productos Tecnológicos</h3>

          <p>
            La tecnología juega un papel cada vez más importante. Considera ofrecer power banks personalizados, adaptadores USB con tu logo o códigos QR impresos en tus productos que dirijan a tu sitio web.
          </p>

          <h3 className="text-xl font-bold text-blue-800 mt-8 mb-4">Personalización y Experiencias Memorables</h3>

          <p>
            Más allá del simple logo, la personalización se centra en crear experiencias únicas y memorables. Los productos promocionales personalizados que apelan a las emociones tienen un mayor impacto.
          </p>
        </section>

        {/* CTA Principal */}
        <CTABanner
          variant="primary"
          title="¿Listo para Impulsar tu Marca en Quito?"
          subtitle="Descubre nuestra colección completa de productos promocionales. Personalización garantizada, entrega en todo Ecuador."
        />

        {/* Conclusión */}
        <section id="conclusion" className="scroll-mt-24">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mt-12 mb-6">
            Conclusión
          </h2>

          <p>
            En Quito, los productos promocionales baratos representan una oportunidad estratégica para amplificar el alcance de tu marca sin comprometer tu presupuesto. Desde bolígrafos personalizados hasta llaveros creativos y memorias USB prácticas, la clave reside en la selección inteligente y la personalización efectiva para conectar con tu público objetivo.
          </p>

          <p>
            Más allá de la simple economía, la elección de productos promocionales baratos en Quito demuestra un entendimiento profundo de las necesidades y preferencias del mercado local. Implica una apuesta por la creatividad y la personalización, transformando artículos sencillos en poderosos embajadores de tu marca.
          </p>

          <p>
            No se trata solo de gastar menos, sino de invertir de forma más inteligente, generando un impacto duradero en la mente de tus clientes potenciales y fortaleciendo la lealtad a tu marca.
          </p>

          <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-2xl p-8 my-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              ¡Es hora de pasar a la acción!
            </h3>
            <p className="text-blue-100 mb-6">
              Contacta hoy mismo y solicita un presupuesto personalizado para tu empresa en Quito.
            </p>
            <Link
              href="/tienda"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300"
            >
              Explorar Catálogo Completo
            </Link>
          </div>
        </section>

      </div>
    </>
  );
}
