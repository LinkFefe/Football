"use client";

import React from "react"; // Importa React

// Definisci le proprietà del componente Input
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string; // Etichetta opzionale
  error?: string | null;  // Messaggio di errore opzionale
  helperText?: string; // Testo di aiuto opzionale
}

// Componente Input
export function Input({
  label,
  error,
  helperText,
  id,
  className = "",
  ...props
}: InputProps) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`; // Genera un ID unico se non fornito

  // Ritorna l'input con etichetta, messaggi di errore e aiuto
  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-white/80"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder:text-white/40 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20 transition-all ${
          error ? "border-red-400/50 focus:border-red-400 focus:ring-red-400/20" : ""
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-white/50">{helperText}</p>
      )}
    </div>
  );
}
