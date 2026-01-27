import { BookingItem } from "@/lib/types"; // Importa il tipo BookingItem
import { Card } from "@/components/ui/Card"; // Importa il componente Card

// Definisci le proprietà del componente OwnerBookingList
interface OwnerBookingListProps {
  bookings: any[]; // Array di prenotazioni
}

// Componente OwnerBookingList
export function OwnerBookingList({ bookings }: OwnerBookingListProps) {
  return (
    <Card>
      <h3 className="text-lg font-semibold">Elenco prenotazioni</h3>
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
          <p className="text-white/40">Nessuna prenotazione attiva</p>
        )}
      </div>
    </Card>
  );
}