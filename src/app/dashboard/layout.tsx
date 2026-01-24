import { SidebarProvider } from "@/components/modals/SidebarModals";
import { DashboardHeader } from "@/components/dashboards/DashboardHeader";
import { Footer } from "@/components/layout/Footer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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