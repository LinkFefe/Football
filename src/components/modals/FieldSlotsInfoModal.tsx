"use client";

import { useEffect, useState } from "react";

// Componente FieldSlotsInfoModal
export function FieldSlotsInfoModal({ fieldId, selectedDay }: { fieldId: number; selectedDay: number }) {
  const [busyTimes, setBusyTimes] = useState<{ start: Date; end: Date }[]>([]); // Orari occupati
  const [loading, setLoading] = useState(false); // Stato di caricamento

  // Effettua il fetch delle prenotazioni per il campo e il giorno selezionato
  useEffect(() => {
    async function fetchBookings() { // Funzione asincrona per il fetch
      setLoading(true); // Imposta lo stato di caricamento a true
      const now = new Date(); // Data e ora attuali
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const day = String(selectedDay).padStart(2, "0"); // Giorno con padding
      const dateStr = `${year}-${String(month).padStart(2, "0")}-${day}`; // Formatta la data
      const response = await fetch(`/api/bookings?fieldId=${fieldId}&date=${dateStr}`); // Effettua la richiesta API
      const data = await response.json(); // Estrai i dati JSON
      setBusyTimes(
        (data.bookings ?? []).map((item: any) => ({
          start: new Date(item.startDate), // Converte in oggetto Date
          end: new Date(item.endDate), // Converte in oggetto Date
        })) 
      );
      setLoading(false); // Imposta lo stato di caricamento a false
    }
    fetchBookings(); // Chiama la funzione di fetch
  }, [fieldId, selectedDay]); // Esegui l'effetto quando fieldId o selectedDay cambiano

  // Genera gli slot orari dalle 08:00 alle 21:30 in incrementi di 30 minuti
  const slots: string[] = [];
  for (let i = 0; i < 28; i++) {
    const hour = 8 + Math.floor(i / 2);
    const minute = i % 2 === 0 ? "00" : "30";
    slots.push(`${String(hour).padStart(2, "0")}:${minute}`);
  }

  const now = new Date(); // Data e ora attuali
  const year = now.getFullYear();
  const month = now.getMonth();

  if (loading) return <div className="text-center text-white/50 text-xs mt-4">Caricamento disponibilità...</div>; // Mostra messaggio di caricamento

  // Renderizza il modal con gli slot orari
  return (
    <div className="mt-4">
      <p className="text-center text-emerald-200 mb-2">Orari disponibili</p>
      <div className="grid grid-cols-4 gap-2 justify-center">
        {slots.map((time) => {
          const [hour, minute] = time.split(":").map(Number); // Estrai ore e minuti
          const slotStart = new Date(year, month, selectedDay, hour, minute, 0, 0); // Inizio slot
          const slotEnd = new Date(slotStart.getTime() + 30 * 60 * 1000); // Fine slot (30 minuti dopo)
          const busy = busyTimes.some((item) => slotStart < item.end && slotEnd > item.start); // Controlla se lo slot è occupato
          return (
            <div
              key={time}
              className={`rounded-lg px-2 py-2 text-xs text-center font-semibold ${busy ? "bg-gray-400/60 text-white/70" : "bg-emerald-400/80 text-[#0b0f14]"}`}
            >
              {time}
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex justify-center gap-4 text-xs text-white/60">
        <span><span className="inline-block w-3 h-3 rounded bg-emerald-400/80 mr-1 align-middle"></span>Disponibile</span>
        <span><span className="inline-block w-3 h-3 rounded bg-gray-400/60 mr-1 align-middle"></span>Occupato</span>
      </div>
    </div>
  );
}