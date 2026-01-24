import { Card } from "@/components/ui/Card";
import { useState } from "react";

interface CalendarDay {
  day: number;
  hasBooking: boolean;
}

interface PlayerCalendarCardProps {
  bookings: any[];
  initialMonth?: number; // 0-11
  initialYear?: number;
}

export function PlayerCalendarCard({ bookings, initialMonth, initialYear }: PlayerCalendarCardProps) {
  const today = new Date();
  const [month, setMonth] = useState<number>(
    typeof initialMonth === "number" ? initialMonth : today.getMonth()
  );
  const [year, setYear] = useState<number>(
    typeof initialYear === "number" ? initialYear : today.getFullYear()
  );

  // Funzioni per cambiare mese
  const handlePrevMonth = () => {
    if (year < today.getFullYear() || (year === today.getFullYear() && month <= today.getMonth())) {
      return;
    }
    if (month === 0) {
      setMonth(11);
      setYear((y: number) => y - 1);
    } else {
      setMonth((m: number) => m - 1);
    }
  };
  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y: number) => y + 1);
    } else {
      setMonth((m: number) => m + 1);
    }
  };

  // Calcola i giorni verdi per il mese/anno selezionato
  const { useCalendarDays } = require("@/hooks/useAvailability");
  const days = useCalendarDays(bookings, month, year);

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