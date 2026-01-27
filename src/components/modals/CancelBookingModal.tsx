"use client";

import React from "react";
import { BookingItem } from "@/lib/types";
import { Button } from "../ui/Button";

// Definisci le proprietà del componente CancelBookingModal
interface CancelBookingModalProps {
  booking: BookingItem | null; // Prenotazione da annullare
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

// Componente CancelBookingModal
export function CancelBookingModal({
  booking,
  isLoading,
  onClose,
  onConfirm,
}: CancelBookingModalProps) {
  if (!booking) return null; // Se non c'è una prenotazione, non renderizzare nulla

  // Renderizza il modal di conferma annullamento prenotazione
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6">
      <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-[#0b0f14] p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-emerald-200">Conferma annullamento</p>
            <h3 className="text-lg font-semibold">{booking.field.name}</h3>
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

        <p className="mt-4 text-sm text-white/70">
          Vuoi annullare la prenotazione del{" "}
          {new Date(booking.startDate).toLocaleString([], {
            dateStyle: "short",
            timeStyle: "short",
          })}?
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button
            variant="secondary"
            size="md"
            className="rounded-full"
            onClick={onClose}
          >
            Torna indietro
          </Button>
          <Button
            variant="danger"
            size="md"
            className="rounded-full"
            onClick={onConfirm}
            disabled={isLoading}
            isLoading={isLoading}
          >
            Annulla prenotazione
          </Button>
        </div>
      </div>
    </div>
  );
}
