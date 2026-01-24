// src/components/dashboards/FieldSlotsInfoModal.tsx
"use client";

import { useEffect, useState } from "react";

export function FieldSlotsInfoModal({ fieldId, selectedDay }: { fieldId: number; selectedDay: number }) {
  const [busyTimes, setBusyTimes] = useState<{ start: Date; end: Date }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchBookings() {
      setLoading(true);
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const day = String(selectedDay).padStart(2, "0");
      const dateStr = `${year}-${String(month).padStart(2, "0")}-${day}`;
      const response = await fetch(`/api/bookings?fieldId=${fieldId}&date=${dateStr}`);
      const data = await response.json();
      setBusyTimes(
        (data.bookings ?? []).map((item: any) => ({
          start: new Date(item.startDate),
          end: new Date(item.endDate),
        }))
      );
      setLoading(false);
    }
    fetchBookings();
  }, [fieldId, selectedDay]);

  const slots: string[] = [];
  for (let i = 0; i < 28; i++) {
    const hour = 8 + Math.floor(i / 2);
    const minute = i % 2 === 0 ? "00" : "30";
    slots.push(`${String(hour).padStart(2, "0")}:${minute}`);
  }

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  if (loading) return <div className="text-center text-white/50 text-xs mt-4">Caricamento disponibilità...</div>;

  return (
    <div className="mt-4">
      <p className="text-center text-emerald-200 mb-2">Orari disponibili</p>
      <div className="grid grid-cols-4 gap-2 justify-center">
        {slots.map((time) => {
          const [hour, minute] = time.split(":").map(Number);
          const slotStart = new Date(year, month, selectedDay, hour, minute, 0, 0);
          const slotEnd = new Date(slotStart.getTime() + 30 * 60 * 1000);
          const busy = busyTimes.some((item) => slotStart < item.end && slotEnd > item.start);
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