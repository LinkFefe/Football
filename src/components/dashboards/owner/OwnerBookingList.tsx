import { BookingItem } from "@/lib/types";
import { Card } from "@/components/ui/Card";

// Estendiamo il tipo BookingItem per includere i dati del giocatore, se necessario
// (in base a come è definito nel tuo types.ts, potrebbe già esserci)
interface OwnerBookingListProps {
  bookings: any[]; // Usa il tipo corretto importato, qui metto any per sicurezza ma usa il tipo reale
}

export function OwnerBookingList({ bookings }: OwnerBookingListProps) {
  return (
    <Card>
      <h3 className="text-lg font-semibold">Prenotazioni campi</h3>
      <div className="mt-4 space-y-3">
        {bookings.map((b) => (
          <div
            key={b.id}
            className="flex justify-between rounded-xl border border-white/10 p-3 text-sm"
          >
            <div className="flex flex-col">
              <span className="font-semibold text-emerald-100">{b.field.name}</span>
              <span className="text-xs text-white/60">
                Giocatore: {b.player.user.name}
              </span>
            </div>
            <div className="flex flex-col items-end justify-center">
              <span className="text-xs text-white/60">
                {new Date(b.startDate).toLocaleDateString()}
              </span>
              <span className="text-xs text-white/60">
                Orario: {b.startDate.slice(11, 16)} - {b.endDate.slice(11, 16)}
              </span>
            </div>
          </div>
        ))}
        {bookings.length === 0 && (
          <p className="text-white/40">Nessuna prenotazione attiva.</p>
        )}
      </div>
    </Card>
  );
}