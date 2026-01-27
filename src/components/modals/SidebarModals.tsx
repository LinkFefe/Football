"use client"; // Indica che questo componente deve essere renderizzato sul client

import { createContext, useContext, useState, ReactNode } from "react"; // Importa le funzioni necessarie da React

// Definisci il tipo per il contesto della sidebar
interface SidebarContextType {
  isOpen: boolean; // Stato di apertura della sidebar
  toggle: () => void; // Funzione per togglare lo stato
  close: () => void; // Funzione per chiudere la sidebar
}

// Crea il contesto della sidebar
const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

// Componente provider per la sidebar
export function SidebarProvider({ children }: { children: ReactNode }) { // Accetta i figli come proprietà
  const [isOpen, setIsOpen] = useState(false); // Stato per tracciare se la sidebar è aperta o chiusa

  const toggle = () => setIsOpen((prev) => !prev); // Funzione per togglare lo stato
  const close = () => setIsOpen(false); // Funzione per chiudere la sidebar

  // Fornisci il contesto ai componenti figli
  return (
    <SidebarContext.Provider value={{ isOpen, toggle, close }}> 
      {children}
    </SidebarContext.Provider>
  );
}

// Hook personalizzato per usare il contesto della sidebar
export function useSidebar() {
  const context = useContext(SidebarContext); // Ottieni il contesto
  if (context === undefined) { // Se il contesto non è definito, lancia un errore
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}