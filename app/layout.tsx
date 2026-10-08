import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Ascend Climbing Series | Plataforma de Competición",
  description: "Directorio de atletas, campeonatos y rankings oficiales de escalada de competición.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased selection:bg-brand-100 selection:text-brand-700 flex flex-col">
        <Navbar />
        
        <main className="flex-1">
          {children}
        </main>

        <footer className="border-t border-border bg-background-surface py-8 text-center text-xs text-foreground-muted">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p>© {new Date().getFullYear()} Ascend Climbing Series. Todos los derechos reservados.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}