"use client"; // Indica che questo componente deve essere renderizzato sul client

import React from "react"; // Importa React per creare componenti

// Definisci le proprietà del componente Modal
interface ModalProps {
  isOpen: boolean; // Stato di apertura della modale
  onClose: () => void; // Funzione per chiudere la modale
  title?: string;
  children: React.ReactNode; // Contenuto della modale
  footer?: React.ReactNode; // Contenuto del footer della modale
  size?: "sm" | "md" | "lg"; 
}

// Componente Modal
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
}: ModalProps) {
  if (!isOpen) return null;

  const sizeStyles = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
  };

  // Ritorna la modale con backdrop, header, contenuto e footer
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        role="presentation"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className={`relative w-full ${sizeStyles[size]} rounded-3xl border border-white/10 bg-[#0b0f14] overflow-auto max-h-[90vh]`}
          onClick={(e) => e.stopPropagation()} // Previene la chiusura quando si clicca all'interno della modale
        >
          {/* Header */}
          {title && (
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <h2 className="text-lg font-semibold text-white">{title}</h2>
              <button
                onClick={onClose}
                className="text-white/60 hover:text-white transition-colors"
                aria-label="Chiudi modale"
                type="button"
              >
                ✕
              </button>
            </div>
          )}

          {/* Content */}
          <div className="px-6 py-4">{children}</div> 

          {/* Footer */}
          {footer && (
            <div className="border-t border-white/10 px-6 py-4">{footer}</div>
          )}
        </div>
      </div>
    </>
  );
}
