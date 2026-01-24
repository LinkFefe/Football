
import { useState } from "react";
import { AdminBookingItem } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface AdminBookingListProps {
  bookings: AdminBookingItem[];
  onDeleteBooking: (booking: AdminBookingItem) => void;
}

export function AdminBookingList({ bookings, onDeleteBooking }: AdminBookingListProps) {
  const [expanded, setExpanded] = useState(false);
  const visibleBookings = expanded ? bookings : (bookings || []).slice(0, 5);
  return (
    <Card>
      <h4 className="text-sm font-semibold text-emerald-200">Prenotazioni</h4>
      <div className="mt-4 space-y-3 text-sm">
        {visibleBookings.map((booking) => (
          <div
            key={booking.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#0b0f14]/70 px-4 py-3"
          >
            <div className="flex flex-col gap-1">
              <span>{booking.field.name}</span>
              <span className="text-xs text-white/60">
                {booking.player.user.name} · {new Date(booking.startDate).toLocaleDateString()}
              </span>
              <span className="text-xs text-white/60">
                Orario: {booking.startDate.slice(11, 16)} - {booking.endDate.slice(11, 16)}
              </span>
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={() => onDeleteBooking(booking)}
              className="rounded-full text-xs font-semibold"
            >
              Elimina
            </Button>
          </div>
        ))}
        {bookings.length === 0 && <p className="text-white/40 italic">Nessuna prenotazione recente.</p>}
      </div>
      {bookings.length > 5 && (
        <Button
          variant="secondary"
          size="sm"
          className="mt-3 w-full rounded-full text-xs font-semibold"
          onClick={() => setExpanded((e) => !e)}
        >
          {expanded ? "Mostra meno" : "Mostra tutte"}
        </Button>
      )}
    </Card>
  );
}