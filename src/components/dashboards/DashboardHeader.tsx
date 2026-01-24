"use client";

import { useSession } from "@/hooks/useSession";
import { useSidebar } from "../modals/SidebarModals";
import { Header } from "@/components/layout"; // Il tuo componente UI esistente
import { useRouter } from "next/navigation";

export function DashboardHeader() {
  const { session, logout } = useSession();
  const { toggle } = useSidebar();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  // Se non c'è sessione (loading o logout), mostriamo un header vuoto o skeleton
  const displayName = session?.name.split(" ")[0] || session?.name || "Utente";

  return (
    <Header
      onMenuToggle={toggle}
      onLogout={handleLogout}
      userName={displayName}
    />
  );
}