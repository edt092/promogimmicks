import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PromoGimmicks - Productos Promocionales y Merchandising",
  description: "Expertos en productos promocionales, merchandising e importación. Encuentra los mejores productos virales y catálogos especializados.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  );
}
