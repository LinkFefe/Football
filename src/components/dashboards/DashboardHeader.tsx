"use client"; // Abilita il rendering lato client

import { useSession } from "@/hooks/useSession";
import { useSidebar } from "../modals/SidebarModals";
import { Header } from "@/components/layout"; 
import { useRouter } from "next/navigation"; // Importa useRouter da Next.js

// Componente DashboardHeader
export function DashboardHeader() {
  const { session, logout } = useSession(); // Importa l'hook useSession
  const { toggle } = useSidebar(); // Importa l'hook useSidebar
  const router = useRouter(); // Inizializza il router

  // Funzione di logout
  const handleLogout = () => {
    logout();
    router.push("/");
  };

  // Se non c'è sessione (loading o logout), mostriamo un header vuoto 
  const displayName = session?.name.split(" ")[0] || session?.name || "Utente";

  // Renderizza il componente Header
  return (
    <Header
      onMenuToggle={toggle} // Funzione per togglare la sidebar
      onLogout={handleLogout} // Funzione di logout
      userName={displayName} // Nome utente da mostrare
    />
  );
}