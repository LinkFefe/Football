import { Card } from "@/components/ui/Card";

interface CalendarDay {
  day: number;
  hasBooking: boolean;
}

interface PlayerCalendarCardProps {
  calendarDays: CalendarDay[];
}

export function PlayerCalendarCard({ calendarDays }: PlayerCalendarCardProps) {
  return (
    <Card>
      <p className="text-sm text-emerald-200">Calendario prenotazioni</p>
      <div className="mt-3 grid grid-cols-7 gap-2">
        {calendarDays.map((item) => (
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