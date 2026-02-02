"use client"; // Indica che questo componente deve essere renderizzato sul client

import React from "react"; // Importa React

// Definisci le proprietà del componente Button
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { // Estendi le proprietà di un normale bottone HTML
  variant?: "primary" | "secondary" | "danger" | "ghost"; // Varianti di stile del bottone
  size?: "sm" | "md" | "lg"; // Dimensioni del bottone
  isLoading?: boolean; // Stato di caricamento
  children: React.ReactNode; // Contenuto del bottone
}

// Componente Button
export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled, 
  className = "", // Classi CSS aggiuntive
  children, // Contenuto del bottone
  ...props
}: ButtonProps) {
  // Definisci le classi di stile base, per variante e per dimensione
  const baseStyles = 
    "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

    // Stili per le diverse varianti di bottone
  const variantStyles = {
    primary:
      "bg-emerald-500 text-[#0b0f14] hover:bg-emerald-400 active:scale-95",
    secondary:
      "border border-white/10 bg-white/5 text-white hover:border-emerald-300 hover:text-emerald-200",
    danger: "bg-red-500/20 text-red-200 border border-red-400/30 hover:bg-red-500/30",
    ghost: "text-white/70 hover:text-white hover:bg-white/5",
  };

  // Stili per le diverse dimensioni di bottone
  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  // Ritorna il bottone con le classi e funzionalità appropriate
  return (
    <button
      disabled={disabled || isLoading} // Disabilita il bottone se è in stato di caricamento o se è disabilitato
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`} // Combina tutte le classi di stile
      {...props}
    >
      {isLoading ? ( // Mostra un indicatore di caricamento se isLoading è true
        <>
          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          {children} {/* Mostra il contenuto del bottone */}
        </> 
      ) : (
        children // Mostra il contenuto del bottone
      )}
    </button>
  );
}
