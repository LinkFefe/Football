import { BookingItem } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface PlayerBookingListProps {
  bookings: BookingItem[];
  onEdit: (booking: BookingItem) => void;
  onCancel: (booking: BookingItem) => void;
}

export function PlayerBookingList({ bookings, onEdit, onCancel }: PlayerBookingListProps) {
  return (
    <Card>
      <h3 className="text-lg font-semibold">Le mie prenotazioni</h3>
      <div className="mt-4 space-y-3">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 bg-[#0b0f14]/70 px-4 py-3 text-sm"
          >
            <span className="font-semibold text-white">{booking.field.name}</span>
            <span className="text-white/60">
              {new Date(booking.startDate).toLocaleString([], {
                dateStyle: "short",
                timeStyle: "short",
              })}
            </span>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onEdit(booking)}
                className="rounded-full border-emerald-400/30 bg-emerald-400/10 text-xs text-emerald-200"
              >
                Modifica
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => onCancel(booking)}
                className="rounded-full text-xs"
              >
                Annulla
              </Button>
            </div>
          </div>
        ))}
        {bookings.length === 0 && (
          <p className="text-sm text-white/50">Nessuna prenotazione disponibile.</p>
        )}
      </div>
    </Card>
  );
}