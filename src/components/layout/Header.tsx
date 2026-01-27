"use client"; // Abilita il rendering lato client

import React from "react"; // Importa React
import { Button } from "../ui/Button"; // Importa il componente Button

// Definisci le proprietà del componente Header
interface HeaderProps {
  onMenuToggle: () => void; // Funzione per togglare il menu
  onLogout: () => void; // Funzione di logout
  userName: string; // Nome utente da mostrare
}

// Componente Header
export function Header({ onMenuToggle, onLogout, userName }: HeaderProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <button
        onClick={onMenuToggle}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#0b0f14]/80 text-white/80 hover:text-white transition-colors"
        type="button"
        aria-label="Apri menu"
      >
        ☰
      </button>
      <span className="text-sm text-white/60 flex-1">{userName}</span>
      <Button
        variant="danger"
        size="md"
        onClick={onLogout}
        className="rounded-full text-xs"
      >
        Logout
      </Button>
    </div>
  );
}
