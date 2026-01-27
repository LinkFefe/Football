import { Card } from "@/components/ui/Card"; // Importa il componente Card
import { useState } from "react"; // Importa useState da React

// Definisci il tipo per i giorni del calendario
interface CalendarDay {
  day: number; // Numero del giorno
  hasBooking: boolean; // Indica se il giorno ha una prenotazione
}

// Definisci il tipo per le proprietà del componente PlayerCalendarCard
interface PlayerCalendarCardProps {
  bookings: any[]; // Array di prenotazioni
  initialMonth?: number; // Mese iniziale opzionale
  initialYear?: number; // Anno iniziale opzionale
}

// Componente PlayerCalendarCard
export function PlayerCalendarCard({ bookings, initialMonth, initialYear }: PlayerCalendarCardProps) {
  const today = new Date(); // Data odierna
  // Stati per mese e anno selezionati
  const [month, setMonth] = useState<number>( 
    typeof initialMonth === "number" ? initialMonth : today.getMonth() // Mese corrente
  );
  const [year, setYear] = useState<number>(
    typeof initialYear === "number" ? initialYear : today.getFullYear() // Anno corrente
  );

  // Funzioni per cambiare mese
  const handlePrevMonth = () => {
    if (year < today.getFullYear() || (year === today.getFullYear() && month <= today.getMonth())) { // Non permettere di andare indietro oltre il mese corrente
      return;
    }
    if (month === 0) { // Se è gennaio, vai a dicembre dell'anno precedente
      setMonth(11);
      setYear((y: number) => y - 1);
    } else {
      setMonth((m: number) => m - 1); // Altrimenti, vai al mese precedente
    }
  };
  // Funzione per andare al mese successivo
  const handleNextMonth = () => { 
    if (month === 11) {
      setMonth(0); // Se è dicembre, vai a gennaio dell'anno successivo
      setYear((y: number) => y + 1); // Aggiorna l'anno
    } else {
      setMonth((m: number) => m + 1); // Altrimenti, vai al mese successivo
    }
  };

  // Calcola i giorni verdi per il mese/anno selezionato
  const { useCalendarDays } = require("@/hooks/useAvailability"); // Importa l'hook useCalendarDays
  const days = useCalendarDays(bookings, month, year); // Ottieni i giorni del calendario

  const monthNames = [
    "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
    "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"
  ];

  return (
    <Card>
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={handlePrevMonth}
          className="text-xs px-2 py-1 rounded bg-white/10 text-white/60"
          disabled={year < today.getFullYear() || (year === today.getFullYear() && month <= today.getMonth())}
          style={{ opacity: year < today.getFullYear() || (year === today.getFullYear() && month <= today.getMonth()) ? 0.5 : 1 }}
        >&lt;</button>
        <span className="text-sm text-emerald-200 font-semibold">
          {monthNames[month]} {year}
        </span>
        <button onClick={handleNextMonth} className="text-xs px-2 py-1 rounded bg-white/10 text-white/60">&gt;</button>
      </div>
      <div className="mt-3 grid grid-cols-7 gap-2">
        {days.map((item: CalendarDay) => (
          <div
            key={item.day}
            className={`flex h-9 items-center justify-center rounded-xl text-xs ${
              item.hasBooking
                ? "bg-emerald-400/30 text-emerald-100"
                : "bg-white/5 text-white/70"
            }`}
          >
            {item.day}
          </div>
        ))}
      </div>
    </Card>
  );
}