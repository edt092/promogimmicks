// Datos geográficos para SEO de páginas locales

export interface Ciudad {
  slug: string;
  nombre: string;
  pais: 'colombia' | 'ecuador';
  seoTitle: string;
  seoDescription: string;
  h1: string;
  intro: string;
  caracteristicas: string[];
}

export interface Pais {
  slug: string;
  nombre: string;
  codigo: string;
  seoTitle: string;
  seoDescription: string;
  h1: string;
  intro: string;
  ciudades: Ciudad[];
}

export const colombia: Pais = {
  slug: 'productos-promocionales-colombia',
  nombre: 'Colombia',
  codigo: 'CO',
  seoTitle: 'Productos Promocionales Colombia | Merchandising Empresarial',
  seoDescription: 'Productos promocionales en Colombia. Merchandising corporativo, artículos publicitarios y regalos empresariales. Envíos a Bogotá, Medellín, Cali, Barranquilla y Cartagena.',
  h1: 'Productos Promocionales en Colombia',
  intro: 'Somos líderes en productos promocionales y merchandising empresarial en Colombia. Ofrecemos la más amplia variedad de artículos publicitarios personalizados para impulsar tu marca en todo el territorio nacional.',
  ciudades: [
    {
      slug: 'bogota',
      nombre: 'Bogotá',
      pais: 'colombia',
      seoTitle: 'Productos Promocionales Bogotá | Merchandising y Artículos Publicitarios',
      seoDescription: 'Productos promocionales en Bogotá. Artículos publicitarios, merchandising corporativo y regalos empresariales. Entrega rápida en toda la capital colombiana.',
      h1: 'Productos Promocionales en Bogotá',
      intro: 'En Bogotá, la capital de Colombia, ofrecemos la más completa selección de productos promocionales y merchandising empresarial. Con entrega rápida en todas las localidades: Chapinero, Usaquén, Suba, Kennedy, Fontibón y más.',
      caracteristicas: [
        'Entrega express en Bogotá y alrededores',
        'Showroom disponible en zona norte',
        'Atención personalizada para empresas capitalinas',
        'Stock disponible para entregas inmediatas'
      ]
    },
    {
      slug: 'medellin',
      nombre: 'Medellín',
      pais: 'colombia',
      seoTitle: 'Productos Promocionales Medellín | Merchandising Empresarial Antioquia',
      seoDescription: 'Productos promocionales en Medellín y Antioquia. Artículos publicitarios personalizados, merchandising corporativo. Envíos a El Poblado, Laureles, Envigado e Itagüí.',
      h1: 'Productos Promocionales en Medellín',
      intro: 'Medellín, la ciudad de la innovación y los negocios, merece los mejores productos promocionales. Atendemos a empresas en El Poblado, Laureles, Envigado, Itagüí, Bello y todo el Valle de Aburrá.',
      caracteristicas: [
        'Envíos a todo el Valle de Aburrá',
        'Productos ideales para ferias y eventos en Plaza Mayor',
        'Atención a empresas del sector textil y tecnológico',
        'Opciones eco-friendly para empresas innovadoras'
      ]
    },
    {
      slug: 'cali',
      nombre: 'Cali',
      pais: 'colombia',
      seoTitle: 'Productos Promocionales Cali | Merchandising Valle del Cauca',
      seoDescription: 'Productos promocionales en Cali y Valle del Cauca. Artículos publicitarios, merchandising corporativo y regalos empresariales. Envíos a toda la región.',
      h1: 'Productos Promocionales en Cali',
      intro: 'Cali, la capital del Valle del Cauca, cuenta con nuestra selección premium de productos promocionales. Atendemos empresas en el norte, sur, oeste y zonas industriales de la sucursal del cielo.',
      caracteristicas: [
        'Envíos a Cali, Palmira, Yumbo y Jamundí',
        'Productos para eventos y ferias regionales',
        'Atención al sector agroindustrial y farmacéutico',
        'Merchandising para el sector salsa y entretenimiento'
      ]
    },
    {
      slug: 'barranquilla',
      nombre: 'Barranquilla',
      pais: 'colombia',
      seoTitle: 'Productos Promocionales Barranquilla | Merchandising Costa Caribe',
      seoDescription: 'Productos promocionales en Barranquilla y la Costa Caribe. Artículos publicitarios, merchandising corporativo. Envíos a Soledad, Malambo y toda la región.',
      h1: 'Productos Promocionales en Barranquilla',
      intro: 'Barranquilla, la puerta de oro de Colombia, merece productos promocionales de primera calidad. Servimos a empresas en el norte, sur, zona industrial y toda el área metropolitana.',
      caracteristicas: [
        'Envíos a toda la Costa Caribe colombiana',
        'Productos resistentes al clima tropical',
        'Atención al sector portuario e industrial',
        'Merchandising para el Carnaval y eventos culturales'
      ]
    },
    {
      slug: 'cartagena',
      nombre: 'Cartagena',
      pais: 'colombia',
      seoTitle: 'Productos Promocionales Cartagena | Merchandising Bolívar',
      seoDescription: 'Productos promocionales en Cartagena de Indias. Artículos publicitarios para turismo, hoteles y empresas. Merchandising corporativo en la costa caribe.',
      h1: 'Productos Promocionales en Cartagena',
      intro: 'Cartagena de Indias, patrimonio de la humanidad y destino turístico mundial, requiere productos promocionales de excelencia. Atendemos hoteles, empresas turísticas y corporaciones en toda la ciudad amurallada y alrededores.',
      caracteristicas: [
        'Productos especiales para sector turístico y hotelero',
        'Merchandising para congresos y convenciones',
        'Artículos resistentes al clima caribeño',
        'Atención a empresas de la zona industrial de Mamonal'
      ]
    }
  ]
};

export const ecuador: Pais = {
  slug: 'productos-promocionales-ecuador',
  nombre: 'Ecuador',
  codigo: 'EC',
  seoTitle: 'Productos Promocionales Ecuador | Merchandising Empresarial',
  seoDescription: 'Productos promocionales en Ecuador. Merchandising corporativo, artículos publicitarios y regalos empresariales. Envíos a Quito, Guayaquil, Cuenca y Manta.',
  h1: 'Productos Promocionales en Ecuador',
  intro: 'Somos tu aliado estratégico en productos promocionales y merchandising empresarial en Ecuador. Ofrecemos artículos publicitarios de alta calidad con cobertura nacional y los mejores tiempos de entrega.',
  ciudades: [
    {
      slug: 'quito',
      nombre: 'Quito',
      pais: 'ecuador',
      seoTitle: 'Productos Promocionales Quito | Merchandising y Artículos Publicitarios',
      seoDescription: 'Productos promocionales en Quito. Artículos publicitarios, merchandising corporativo y regalos empresariales. Entrega en toda la capital ecuatoriana.',
      h1: 'Productos Promocionales en Quito',
      intro: 'En Quito, capital del Ecuador, brindamos soluciones integrales en productos promocionales y merchandising. Atendemos empresas en el norte, centro histórico, valles de Cumbayá, Tumbaco, Los Chillos y toda la ciudad.',
      caracteristicas: [
        'Entrega en todo el Distrito Metropolitano',
        'Atención a empresas del sector público y privado',
        'Productos para ferias en Quorum y centros de convenciones',
        'Stock disponible para entregas inmediatas'
      ]
    },
    {
      slug: 'guayaquil',
      nombre: 'Guayaquil',
      pais: 'ecuador',
      seoTitle: 'Productos Promocionales Guayaquil | Merchandising Empresarial Costa',
      seoDescription: 'Productos promocionales en Guayaquil. Artículos publicitarios, merchandising corporativo. Envíos a Samborondón, Durán y toda la provincia del Guayas.',
      h1: 'Productos Promocionales en Guayaquil',
      intro: 'Guayaquil, el motor económico del Ecuador, cuenta con nuestra completa línea de productos promocionales. Servimos a empresas en el centro, norte, sur, Samborondón, Durán y toda la provincia del Guayas.',
      caracteristicas: [
        'Envíos a toda la provincia del Guayas',
        'Productos resistentes al clima costero',
        'Atención al sector comercial e industrial',
        'Merchandising para ferias y eventos empresariales'
      ]
    },
    {
      slug: 'cuenca',
      nombre: 'Cuenca',
      pais: 'ecuador',
      seoTitle: 'Productos Promocionales Cuenca | Merchandising Azuay',
      seoDescription: 'Productos promocionales en Cuenca y Azuay. Artículos publicitarios personalizados, merchandising corporativo. Envíos a toda la región austral.',
      h1: 'Productos Promocionales en Cuenca',
      intro: 'Cuenca, patrimonio cultural de la humanidad, merece productos promocionales de la más alta calidad. Atendemos empresas, instituciones y organizaciones en toda la ciudad y provincia del Azuay.',
      caracteristicas: [
        'Envíos a toda la región austral del Ecuador',
        'Productos artesanales y eco-friendly',
        'Atención al sector turístico y educativo',
        'Merchandising para ferias artesanales y culturales'
      ]
    },
    {
      slug: 'manta',
      nombre: 'Manta',
      pais: 'ecuador',
      seoTitle: 'Productos Promocionales Manta | Merchandising Manabí',
      seoDescription: 'Productos promocionales en Manta y Manabí. Artículos publicitarios para empresas pesqueras, turísticas e industriales. Envíos a toda la provincia.',
      h1: 'Productos Promocionales en Manta',
      intro: 'Manta, puerto principal del Ecuador, cuenta con nuestra línea especializada de productos promocionales. Servimos a empresas del sector pesquero, turístico, industrial y comercial de toda la provincia de Manabí.',
      caracteristicas: [
        'Envíos a toda la provincia de Manabí',
        'Productos para sector pesquero y marítimo',
        'Atención a industrias atuneras y exportadoras',
        'Merchandising resistente al clima costero'
      ]
    }
  ]
};

export const paises = [colombia, ecuador];

export function getPaisBySlug(slug: string): Pais | undefined {
  return paises.find(p => p.slug === slug);
}

export function getCiudadBySlug(paisSlug: string, ciudadSlug: string): Ciudad | undefined {
  const pais = getPaisBySlug(paisSlug);
  return pais?.ciudades.find(c => c.slug === ciudadSlug);
}

export function getAllCiudades(): Ciudad[] {
  return paises.flatMap(p => p.ciudades);
}
