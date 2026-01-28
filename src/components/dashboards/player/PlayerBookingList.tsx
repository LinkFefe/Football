import { BookingItem } from "@/lib/types"; // Importa il tipo BookingItem
import { Button } from "@/components/ui/Button"; // Importa il componente Button
import { Card } from "@/components/ui/Card"; // Importa il componente Card

// Definisci le proprietà del componente PlayerBookingList
interface PlayerBookingListProps {
  bookings: BookingItem[]; // Array di prenotazioni
  onEdit: (booking: BookingItem) => void; // Funzione di callback per la modifica
  onCancel: (booking: BookingItem) => void; // Funzione di callback per l'annullamento
}

// Componente PlayerBookingList
export function PlayerBookingList({ bookings, onEdit, onCancel }: PlayerBookingListProps) { // Riceve le prenotazioni e le funzioni di callback come props
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
              {new Date(booking.startDate).toLocaleDateString()} &nbsp;&nbsp; 
              {new Date(booking.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              -
              {new Date(booking.endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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