"use client";

import React from "react";
import { BookingItem } from "@/lib/types";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";

// Definisci le proprietà del componente EditBookingModal
interface EditBookingModalProps {
    availableTimes?: string[]; // Nuovo prop per gli orari disponibili
  booking: BookingItem | null;
  date: string;
  setDate: (date: string) => void;
  time: string;
  setTime: (time: string) => void;
  duration: number;
  setDuration: (duration: number) => void;
  isLoading: boolean;
  error: string | null;
  onClose: () => void;
  onConfirm: () => void;
}

// Componente EditBookingModal
export function EditBookingModal({
  booking,
  date,
  setDate,
  time,
  setTime,
  duration,
  setDuration,
  isLoading,
  error,
  onClose,
  onConfirm,
  availableTimes = [],
}: EditBookingModalProps) {
  if (!booking) return null;

  // Genera gli slot orari dalle 08:00 alle 21:30 in incrementi di 30 minuti
  const slots = [];
  for (let i = 0; i < 28; i++) {
    const hour = 8 + Math.floor(i / 2);
    const minute = i % 2 === 0 ? "00" : "30";
    slots.push(`${String(hour).padStart(2, "0")}:${minute}`);
  }

  // Renderizza il modal di modifica prenotazione
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0b0f14] p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-emerald-200">Modifica prenotazione</p>
            <h3 className="text-xl font-semibold">{booking.field.name}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-black hover:text-white"
            aria-label="Chiudi"
          >
            ✕
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <Input
            label="Giorno"
            type="date"
            value={date}
            min={new Date().toISOString().slice(0, 10)} // Imposta la data minima a oggi
            onChange={(e) => setDate(e.target.value)}
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/80">
              Ora
            </label>
            <div className="grid grid-cols-4 gap-2">
              {slots.map((slot) => { // Mappa attraverso tutti gli slot orari
                const isCurrent = time === slot; // Controlla se è l'orario attuale della prenotazione
                const isAvailable = isCurrent || availableTimes.length === 0 || availableTimes.includes(slot); // Controlla se lo slot è disponibile
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => isAvailable && setTime(slot)} // Imposta l'orario solo se è disponibile
                    className={`rounded-lg px-2 py-2 text-xs font-semibold w-full text-center transition-all duration-100 border-2 ${
                      isAvailable // Controlla se lo slot è disponibile
                        ? time === slot // Controlla se è l'orario selezionato
                          ? "bg-emerald-700 text-white border-emerald-900 shadow-md"
                          : "bg-emerald-400/80 text-[#0b0f14] border-transparent"
                        : "bg-gray-400/60 text-white/70 cursor-not-allowed border-transparent"
                    } ${
                      isAvailable && time !== slot // Aggiungi hover solo se lo slot è disponibile e non selezionato
                        ? "hover:bg-emerald-700 hover:text-white"
                        : ""
                    }`}
                    disabled={isLoading || (!isAvailable && !isCurrent)} // Disabilita il bottone se non è disponibile e non è l'orario attuale
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>

          <Select
            label="Durata"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            options={[
              { value: 1, label: "1h" },
              { value: 1.5, label: "1h 30min" },
            ]}
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
            disabled={isLoading || !date || !time}
            isLoading={isLoading}
          >
            Salva modifiche
          </Button>
        </div>
      </div>
    </div>
  );
}
