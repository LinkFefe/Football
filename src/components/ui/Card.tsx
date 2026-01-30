"use client"; // Indica che questo componente deve essere renderizzato sul client

import React from "react"; // Importa React

// Definisci le proprietà del componente Card
interface CardProps {
  children: React.ReactNode; // Elementi figli da renderizzare all'interno del card
  className?: string; // Classi CSS aggiuntive
  variant?: "default" | "gradient" | "featured"; // Varianti di stile del card
}

// Componente Card
export function Card({
  children,
  className = "",
  variant = "default",
}: CardProps) { 
  const variantStyles = { // Definisci le classi di stile per ogni variante
    default: "rounded-3xl border border-white/10 bg-white/5 p-6",
    gradient:
      "rounded-3xl border border-white/10 bg-gradient-to-r from-emerald-500/20 via-emerald-500/10 to-blue-500/20 p-6",
    featured:
      "rounded-3xl border border-emerald-400/30 bg-gradient-to-br from-emerald-500/45 via-emerald-500/20 to-blue-500/25 p-6 shadow-[0_20px_50px_rgba(16,185,129,0.25)]",
  };

  // Ritorna il card con le classi appropriate
  return (
    <div className={`${variantStyles[variant]} ${className}`}>{children}</div>
  );
}
