'use client';

import { MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Columna 1: Información de Contacto */}
          <div>
            <h3 className="text-2xl font-bold text-amber-500 mb-4">
              PromoGimmicks
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Mail className="text-amber-500 mt-1 flex-shrink-0" size={20} />
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <a
                    href="mailto:info@promogimmicks.com"
                    className="text-white hover:text-amber-500 transition-colors"
                  >
                    info@promogimmicks.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="text-amber-500 mt-1 flex-shrink-0" size={20} />
                <div>
                  <p className="text-sm text-gray-400">Teléfono</p>
                  <a
                    href="tel:+593998594123"
                    className="text-white hover:text-amber-500 transition-colors"
                  >
                    +593 99 859 4123
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Columna 2: Oficinas y Planta */}
          <div>
            <h4 className="text-lg font-bold mb-4">Ubicaciones</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="text-amber-500 mt-1 flex-shrink-0" size={20} />
                <div>
                  <p className="text-sm text-gray-400">Oficinas</p>
                  <p className="text-white">
                    Calle 145 #7B-58, Cedritos
                    <br />
                    Bogotá, Colombia
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="text-amber-500 mt-1 flex-shrink-0" size={20} />
                <div>
                  <p className="text-sm text-gray-400">Planta</p>
                  <p className="text-white">
                    Carrera 54 #5B-25
                    <br />
                    Zona Industrial, Bogotá
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Columna 3: Bodega */}
          <div>
            <h4 className="text-lg font-bold mb-4">Almacenamiento</h4>
            <div className="flex items-start gap-3">
              <MapPin className="text-amber-500 mt-1 flex-shrink-0" size={20} />
              <div>
                <p className="text-sm text-gray-400">Bodega</p>
                <p className="text-white">
                  Transversal 28ª #37-70
                  <br />
                  Bogotá, Colombia
                </p>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-lg font-bold mb-3">Enlaces Rápidos</h4>
              <div className="space-y-2">
                <a
                  href="#inicio"
                  className="block text-gray-400 hover:text-amber-500 transition-colors"
                >
                  Inicio
                </a>
                <a
                  href="#productos-virales"
                  className="block text-gray-400 hover:text-amber-500 transition-colors"
                >
                  Productos Virales
                </a>
                <a
                  href="#catalogos"
                  className="block text-gray-400 hover:text-amber-500 transition-colors"
                >
                  Catálogos
                </a>
                <a
                  href="#servicios"
                  className="block text-gray-400 hover:text-amber-500 transition-colors"
                >
                  Servicios
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Separador */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              &copy; {currentYear} PromoGimmicks. Todos los derechos reservados.
            </p>
            <p className="text-gray-400 text-sm text-center md:text-right">
              Diseñado por{' '}
              <a
                href="https://edwinbayonaitmanager.online"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-500 hover:text-amber-400 transition-colors"
              >
                Bayona Digital Systems
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
