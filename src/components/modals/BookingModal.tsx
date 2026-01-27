"use client"; // Rendering lato client

import React from "react"; 
import { FieldItem } from "@/lib/types";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";

// Definisci le proprietà del componente BookingModal
interface BookingModalProps {
  field: FieldItem | null;
  date: string;
  setDate: (date: string) => void;
  time: string;
  setTime: (time: string) => void;
  duration: number;
  setDuration: (duration: number) => void;
  availableTimes: string[]; // Orari disponibili per la data selezionata
  isLoading: boolean;
  error: string | null;
  success: string | null;
  onClose: () => void; // Funzione per chiudere il modal
  onConfirm: () => void; // Funzione per confermare la prenotazione
}

// Componente BookingModal
export function BookingModal({
  field,
  date,
  setDate,
  time,
  setTime,
  duration,
  setDuration,
  availableTimes,
  isLoading,
  error,
  success,
  onClose,
  onConfirm,
}: BookingModalProps) {
  if (!field) return null;

  // Genera gli slot orari dalle 08:00 alle 21:30
  const slots = [];
  for (let i = 0; i < 28; i++) {
    const hour = 8 + Math.floor(i / 2);
    const minute = i % 2 === 0 ? "00" : "30";
    slots.push(`${String(hour).padStart(2, "0")}:${minute}`); // Formatta come "HH:MM"
  }

  // Renderizza il modal di prenotazione
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0b0f14] p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-emerald-200">Prenota campo</p>
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
            label="Giorno"
            type="date"
            value={date}
            min={new Date().toISOString().slice(0, 10)} // Imposta la data minima a oggi
            onChange={(e) => setDate(e.target.value)} // Aggiorna la data selezionata
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/80">
              Ora
            </label>
            <div className="grid grid-cols-4 gap-2">
              {slots.map((slot) => {
                const isAvailable = availableTimes.includes(slot); // Verifica se lo slot è disponibile
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => isAvailable && setTime(slot)} // Imposta l'ora se disponibile
                    className={`rounded-lg px-2 py-2 text-xs font-semibold w-full text-center transition-all duration-100 border-2 ${
                      isAvailable // Stile in base alla disponibilità
                        ? time === slot // Stile se selezionato
                          ? "bg-emerald-700 text-white border-emerald-900 shadow-md"
                          : "bg-emerald-400/80 text-[#0b0f14] border-transparent"
                        : "bg-gray-400/60 text-white/70 cursor-not-allowed border-transparent"
                    } ${
                      isAvailable && time !== slot // Aggiungi hover solo se disponibile e non selezionato
                        ? "hover:bg-emerald-700 hover:text-white"
                        : ""
                    }`}
                    disabled={isLoading || !isAvailable} // Disabilita se in caricamento o non disponibile
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
            <div className="mt-2 flex justify-center gap-4 text-xs text-white/60">
              <span>
                <span className="inline-block w-3 h-3 rounded bg-emerald-400/80 mr-1 align-middle" />
                Disponibile
              </span>
              <span>
                <span className="inline-block w-3 h-3 rounded bg-gray-400/60 mr-1 align-middle" />
                Occupato
              </span>
            </div>
          </div>

          <Select
            label="Durata"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))} // Aggiorna la durata selezionata
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

          {success && (
            <div className="rounded-xl border border-emerald-400/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
              {success}
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
            Conferma prenotazione
          </Button>
        </div>
      </div>
    </div>
  );
}
