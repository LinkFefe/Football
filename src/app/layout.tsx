import type { Metadata } from "next"; // Importa il tipo Metadata da Next.js per definire i metadati della pagina
import { Geist, Geist_Mono } from "next/font/google"; // Importa i font Geist e Geist Mono da Google Fonts
import "./globals.css"; // Importa i file CSS globali

// Configura i font Geist e Geist Mono
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});


// Configura i font Geist Mono
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Definisce i metadati della pagina
export const metadata: Metadata = {
  title: "Cozy Football",
  description:
    "Prenota campetti da calcio con un'esperienza moderna e intuitiva.",
};

// Componente principale del layout dell'applicazione
export default function RootLayout({
  children, // Contenuto figlio da rendere all'interno del layout
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-[#0b0f14] text-white antialiased`}
      >
        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0b0f14]/90 backdrop-blur">
            <div className="flex w-full items-center justify-between px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/20 text-emerald-300">
                  ⚽
                </div>
                <div>
                  <p className="text-sm text-emerald-200"></p>
                  <p className="text-lg font-semibold">Cozy Football</p>
                </div>
              </div>
              <nav className="hidden items-center gap-6 text-sm md:flex">
                <a className="text-white/70 hover:text-white" href="/">
                  Home
                </a>
                <a className="text-white/70 hover:text-white" href="/#vantaggi">
                  Vantaggi
                </a>
                <a className="text-white/70 hover:text-white" href="/#come-funziona">
                  Come funziona
                </a>
              </nav>
            </div>
          </header>
          <main className="flex-1">{children}</main> {/* Rende il contenuto figlio */}
          <footer className="border-t border-white/10 bg-[#0b0f14]">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-8 text-sm text-white/60 md:flex-row md:items-center md:justify-between">
              <p>© 2026 Soccer Field Booking. Tutti i diritti riservati.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
