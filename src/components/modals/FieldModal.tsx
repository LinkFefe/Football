"use client";

import React from "react";
import { FieldItem } from "@/lib/types";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

// Definisci le proprietà del componente FieldModal
interface FieldModalProps {
  field: FieldItem | null; 
  fieldName: string;
  setFieldName: (name: string) => void;
  fieldSize: string;
  setFieldSize: (size: string) => void;
  fieldLocation: string;
  setFieldLocation: (location: string) => void;
  fieldImageUrl: string;
  setFieldImageUrl: (url: string) => void;
  isLoading: boolean;
  error: string | null;
  onClose: () => void;
  onConfirm: () => void;
}

// Componente FieldModal
export function FieldModal({
  field,
  fieldName,
  setFieldName,
  fieldSize,
  setFieldSize,
  fieldLocation,
  setFieldLocation,
  fieldImageUrl,
  setFieldImageUrl,
  isLoading,
  error,
  onClose,
  onConfirm,
}: FieldModalProps) {
  if (!field) return null;

  // Renderizza il modal di modifica campo
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0b0f14] p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-emerald-200">Modifica campo</p>
            <h3 className="text-xl font-semibold">{field.name}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/60 hover:text-white"
            aria-label="Chiudi"
          >
            ✕
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <Input
            label="Nome campo"
            value={fieldName}
            onChange={(e) => setFieldName(e.target.value)}
          />

          <Input
            label="Dimensione"
            value={fieldSize}
            onChange={(e) => setFieldSize(e.target.value)}
          />

          <Input
            label="Luogo"
            value={fieldLocation}
            onChange={(e) => setFieldLocation(e.target.value)}
          />

          <Input
            label="URL immagine"
            value={fieldImageUrl}
            onChange={(e) => setFieldImageUrl(e.target.value)}
            placeholder="https://..."
          />

          {error && (
            <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error} 
            </div>
          )}

          <Button
            variant="primary"
            size="lg"
            className="w-full rounded-full"
            onClick={onConfirm}
            disabled={isLoading}
            isLoading={isLoading}
          >
            Salva modifiche
          </Button>
        </div>
      </div>
    </div>
  );
}
