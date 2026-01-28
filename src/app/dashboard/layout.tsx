import { SidebarProvider } from "@/components/modals/SidebarModals"; // Importa il provider del contesto della sidebar
import { DashboardHeader } from "@/components/dashboards/DashboardHeader"; // Importa l'header della dashboard
import { Footer } from "@/components/layout/Footer"; // Importa il footer

// Layout principale della dashboard
export default function DashboardLayout({
  children, // Contenuto figlio da rendere all'interno del layout
}: {
  children: React.ReactNode; // Tipo del contenuto figlio
}) {
  // Fornisce il contesto della sidebar e struttura la pagina della dashboard
  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col bg-[#0b0f14] text-white">
        {/* Header fisso o sticky */}
        <DashboardHeader />
        
        {/* Contenuto Principale */}
        <main className="flex-1">
            {children}
        </main>

      </div>
    </SidebarProvider>
  );
}