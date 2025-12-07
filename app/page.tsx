import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ProductosVirales from '@/components/ProductosVirales';
import Catalogos from '@/components/Catalogos';
import Servicios from '@/components/Servicios';
import ProductosGallery from '@/components/ProductosGallery';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <ProductosVirales />
      <Catalogos />
      <Servicios />
      <ProductosGallery />
      <ContactSection />
      <Footer />
    </main>
  );
}
